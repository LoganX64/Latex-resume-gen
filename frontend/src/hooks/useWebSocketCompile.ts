import { useCallback, useRef, useState } from 'react'

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

  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
  }, [])

  const startCompile = useCallback((latex: string, profileImage: string) => {
    cleanup()
    setProgress([])
    setStatus('connecting')
    setError('')
    setResult(null)

    console.log('[WS] Connecting to', WS_URL)
    const ws = new WebSocket(WS_URL)
    wsRef.current = ws

    timeoutRef.current = setTimeout(() => {
      console.error('[WS] Connection timed out')
      ws.close()
      setError('Connection timed out. Is the backend running?')
      setStatus('error')
      wsRef.current = null
    }, CONNECT_TIMEOUT_MS)

    ws.onopen = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      console.log('[WS] Connected, sending compile request')
      setStatus('compiling')
      ws.send(JSON.stringify({ latex, profileImage }))
    }

    ws.onmessage = (event) => {
      console.log('[WS] Message:', typeof event.data, event.data instanceof Blob ? 'blob' : event.data)
      if (typeof event.data === 'string') {
        const msg = JSON.parse(event.data)
        console.log('[WS] Parsed:', msg)

        if (msg.type === 'progress') {
          setProgress((prev) => {
            const existing = prev.findIndex((p) => p.step === msg.step)
            const step: CompileStep = {
              step: msg.step,
              message: msg.message,
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
          console.log('[WS] Complete, pageCount:', msg.pageCount)
          setProgress((prev) => [
            ...prev,
            { step: 'done', message: 'Done' },
          ])
          setStatus('done')
        } else if (msg.type === 'error') {
          console.log('[WS] Error:', msg.message)
          setError(msg.message)
          setStatus('error')
          ws.close()
        }
      } else {
        console.log('[WS] Received PDF blob')
        const blob = new Blob([event.data], { type: 'application/pdf' })
        setResult({ pdfBlob: blob, pageCount: 0 })
        ws.close()
      }
    }

    ws.onerror = (e) => {
      console.error('[WS] Error event:', e)
      setError('WebSocket connection failed')
      setStatus('error')
    }

    ws.onclose = (e) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      if (status === 'compiling' || status === 'connecting') {
        setError('Connection lost during compilation')
        setStatus('error')
      }
      console.log('[WS] Closed:', e.code, e.reason)
      wsRef.current = null
    }
  }, [cleanup])

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
  }, [cleanup])

  return { progress, status, error, result, startCompile, cancel, reset }
}
