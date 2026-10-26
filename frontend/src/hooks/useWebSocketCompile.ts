import { useCallback, useRef, useState } from 'react'
import * as Sentry from '@sentry/react'

export interface CompileStep {
  step: string
  message: string
  output?: string
}

export interface CompileResult {
  pdfBlob: Blob | null
  pageCount: number
}

type CompileStatus = 'idle' | 'connecting' | 'compiling' | 'done' | 'error'

const WS_BASE = import.meta.env.VITE_WS_URL || `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}`
const WS_API_KEY = import.meta.env.VITE_COMPILE_API_KEY || ''
const WS_URL = `${WS_BASE}/api/compile/ws?key=${encodeURIComponent(WS_API_KEY)}`
const CONNECT_TIMEOUT_MS = 15_000

export function useWebSocketCompile() {
  const [progress, setProgress] = useState<CompileStep[]>([])
  const [status, setStatus] = useState<CompileStatus>('idle')
  const [error, setError] = useState<string>('')
  const [result, setResult] = useState<CompileResult | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isCompilingRef = useRef(false)
  const pageCountRef = useRef(1)
  const capturedErrorRef = useRef(false)

  const captureCompileError = useCallback((
    message: string,
    stage: string,
    extra?: Record<string, unknown>,
  ) => {
    if (capturedErrorRef.current) return
    capturedErrorRef.current = true
    Sentry.captureException(new Error(message), {
      tags: { feature: 'compile-ws', stage },
      extra,
      fingerprint: ['compile-ws', stage],
    })
  }, [])

  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    isCompilingRef.current = false
  }, [])

  const startCompile = useCallback((latex: string, profileImage: string) => {
    cleanup()
    setProgress([])
    setStatus('connecting')
    setError('')
    setResult(null)
    pageCountRef.current = 1
    capturedErrorRef.current = false

    const ws = new WebSocket(WS_URL)
    wsRef.current = ws

    timeoutRef.current = setTimeout(() => {
      if (wsRef.current !== ws) return
      captureCompileError('Compile connection timed out', 'timeout', {
        timeoutMs: CONNECT_TIMEOUT_MS,
      })
      ws.close()
      setError('Connection timed out. Is the backend running?')
      setStatus('error')
      wsRef.current = null
    }, CONNECT_TIMEOUT_MS)

    ws.onopen = () => {
      if (wsRef.current !== ws) return
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      isCompilingRef.current = true
      setStatus('compiling')
      ws.send(JSON.stringify({ latex, profileImage }))
    }

    ws.onmessage = (event) => {
      if (wsRef.current !== ws) return

      if (typeof event.data === 'string') {
        let msg: {
          type?: string
          step?: string
          message?: string
          output?: string
          pageCount?: number
        }
        try {
          msg = JSON.parse(event.data)
        } catch (err) {
          isCompilingRef.current = false
          captureCompileError('Invalid message from compile server', 'parse', {
            error: err instanceof Error ? err.message : String(err),
          })
          setError('Invalid response from compile server')
          setStatus('error')
          ws.close()
          return
        }

        if (msg.type === 'progress') {
          setProgress((prev) => {
            const existing = prev.findIndex((p) => p.step === msg.step)
            const step: CompileStep = {
              step: msg.step ?? 'unknown',
              message: msg.message ?? '',
              output: msg.output,
            }
            if (existing >= 0) {
              const updated = [...prev]
              updated[existing] = step
              return updated
            }
            return [...prev, step]
          })
        } else if (msg.type === 'complete') {
          isCompilingRef.current = false
          pageCountRef.current =
            typeof msg.pageCount === 'number' &&
            Number.isInteger(msg.pageCount) &&
            msg.pageCount > 0
              ? msg.pageCount
              : 1
          setProgress((prev) => [
            ...prev,
            { step: 'done', message: 'Done' },
          ])
          setStatus('done')
        } else if (msg.type === 'error') {
          isCompilingRef.current = false
          captureCompileError(msg.message || 'Compilation failed', 'server', {
            output: msg.output,
          })
          setError(msg.message || 'Compilation failed')
          setStatus('error')
          ws.close()
        }
      } else {
        const blob = new Blob([event.data], { type: 'application/pdf' })
        setResult({ pdfBlob: blob, pageCount: pageCountRef.current })
        isCompilingRef.current = false
        ws.close()
      }
    }

    ws.onerror = () => {
      if (wsRef.current !== ws) return
      isCompilingRef.current = false
      captureCompileError('WebSocket connection failed', 'websocket-error')
      setError('WebSocket connection failed')
      setStatus('error')
    }

    ws.onclose = (event) => {
      if (wsRef.current !== ws) return
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      if (isCompilingRef.current) {
        isCompilingRef.current = false
        captureCompileError('Connection lost during compilation', 'connection-lost', {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
        })
        setError('Connection lost during compilation')
        setStatus('error')
      }
      wsRef.current = null
    }
  }, [cleanup, captureCompileError])

  const cancel = useCallback(() => {
    cleanup()
    setStatus('idle')
    setProgress([])
  }, [cleanup])

  const reset = useCallback(() => {
    cleanup()
    setStatus('idle')
    setProgress([])
    setError('')
    setResult(null)
    isCompilingRef.current = false
    pageCountRef.current = 1
  }, [cleanup])

  return { progress, status, error, result, startCompile, cancel, reset }
}
