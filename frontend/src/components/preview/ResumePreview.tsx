import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useResumeStore } from '@/stores/resume-store'
import { loadTemplate, getTemplateConfig } from '@/templates'
import { AlertTriangle, Maximize, X, ZoomIn, ZoomOut } from 'lucide-react'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import * as Sentry from '@sentry/react'
import type { ZoomLevel, Margins } from '@/types/resume'
import type { Template } from '@/templates'

const A4_WIDTH_MM = 210
const A4_HEIGHT_MM = 297
const MM_TO_PX = 3.7795275591
const A4_WIDTH_PX = Math.round(A4_WIDTH_MM * MM_TO_PX)
const A4_HEIGHT_PX = Math.round(A4_HEIGHT_MM * MM_TO_PX)
const DEFAULT_MARGINS: Margins = { top: 7.62, bottom: 7.62, left: 7.62, right: 7.62 }

const zoomLevels: ZoomLevel[] = [50, 75, 100, 125, 150]

interface ResumePreviewProps {
  initialZoom?: ZoomLevel
  hideToolbar?: boolean
  zoom?: ZoomLevel
  onZoomChange?: (zoom: ZoomLevel) => void
  fullscreen?: boolean
  onToggleFullscreen?: () => void
}

export function ResumePreview({ initialZoom, hideToolbar, zoom: externalZoom, onZoomChange, fullscreen: externalFullscreen, onToggleFullscreen }: ResumePreviewProps) {
  const storeZoom = useResumeStore((s) => s.zoom)
  const setStoreZoom = useResumeStore((s) => s.setZoom)
  const [overrideZoom, setOverrideZoom] = useState<ZoomLevel | null>(initialZoom ?? null)
  const zoom = externalZoom ?? (overrideZoom ?? storeZoom)
  const setZoom = (z: ZoomLevel) => {
    if (onZoomChange) {
      onZoomChange(z)
    } else if (overrideZoom != null) {
      setOverrideZoom(z)
    } else {
      setStoreZoom(z)
    }
  }
  const resume = useResumeStore((s) => s.resume)
  const sectionOrder = useResumeStore((s) => s.sectionOrder)
  const sectionVisibility = useResumeStore((s) => s.sectionVisibility)
  const templateId = useResumeStore((s) => s.templateId)
  const pageRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const [totalContentHeight, setTotalContentHeight] = useState(0)
  const [sectionBounds, setSectionBounds] = useState<{ top: number; height: number }[]>([])
  const [internalFullscreen, setInternalFullscreen] = useState(false)
  const isFullscreen = externalFullscreen ?? internalFullscreen
  const [viewport, setViewport] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }))
  const isDragging = useRef(false)
  const [showGrabbing, setShowGrabbing] = useState(false)
  const dragStart = useRef({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0, active: false })
  const pinchStart = useRef<{ distance: number; scale: number } | null>(null)
  const [pinchScale, setPinchScale] = useState(1)
  const pinchScaleRef = useRef(1)

  const scale = zoom === 'fit' ? 1 : zoom / 100
  const [template, setTemplate] = useState<Template | null>(null)
  const config = getTemplateConfig(templateId)
  const margins = useMemo(() => config?.margins ?? DEFAULT_MARGINS, [config])

  const paddingY = (margins.top + margins.bottom) * MM_TO_PX
  const paddingX = (margins.left + margins.right) * MM_TO_PX
  const contentAreaHeight = A4_HEIGHT_PX - paddingY

  const pageOffsets = useMemo(() => {
    if (totalContentHeight <= 0) return [0]
    if (sectionBounds.length === 0) {
      const count = Math.max(1, Math.ceil(totalContentHeight / contentAreaHeight))
      return Array.from({ length: count }, (_, i) => i * contentAreaHeight)
    }

    const offsets: number[] = [0]
    let currentOffset = 0

    while (currentOffset + contentAreaHeight < totalContentHeight) {
      const pageEnd = currentOffset + contentAreaHeight
      let needPush = false

      for (const section of sectionBounds) {
        const sectionStart = section.top
        const sectionEnd = section.top + section.height

        if (sectionStart < pageEnd && sectionEnd > pageEnd && section.height <= contentAreaHeight) {
          currentOffset = sectionEnd
          needPush = true
          break
        }
      }

      if (!needPush) {
        currentOffset = pageEnd
      }

      if (currentOffset < totalContentHeight) {
        offsets.push(currentOffset)
      }
    }

    return offsets
  }, [totalContentHeight, contentAreaHeight, sectionBounds])

  const numberOfPages = Math.max(1, pageOffsets.length)
  const isOverflowing = numberOfPages > 1

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const DRAG_THRESHOLD = 5

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return
      dragStart.current = {
        x: e.clientX,
        y: e.clientY,
        scrollLeft: el.scrollLeft,
        scrollTop: el.scrollTop,
        active: true,
      }
      isDragging.current = false
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!dragStart.current.active) return
      const dx = e.clientX - dragStart.current.x
      const dy = e.clientY - dragStart.current.y

      if (!isDragging.current) {
        if (Math.abs(dx) <= DRAG_THRESHOLD && Math.abs(dy) <= DRAG_THRESHOLD) return
        isDragging.current = true
        setShowGrabbing(true)
      }

      e.preventDefault()
      el.scrollLeft = dragStart.current.scrollLeft - dx
      el.scrollTop = dragStart.current.scrollTop - dy
    }

    const onSelectStart = (e: Event) => {
      if (isDragging.current) {
        e.preventDefault()
      }
    }

    const onMouseUp = () => {
      isDragging.current = false
      setShowGrabbing(false)
      dragStart.current = { ...dragStart.current, active: false }
    }

    const onDragStart = (e: DragEvent) => {
      e.preventDefault()
    }

    el.addEventListener('mousedown', onMouseDown)
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    document.addEventListener('selectstart', onSelectStart)
    el.addEventListener('dragstart', onDragStart)

    return () => {
      el.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('selectstart', onSelectStart)
      el.removeEventListener('dragstart', onDragStart)
    }
  }, [])

  useEffect(() => {
    pinchScaleRef.current = pinchScale
  }, [pinchScale])

  useEffect(() => {
    setPinchScale(1)
  }, [zoom])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const getDistance = (t: TouchList) =>
      Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY)

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 2) {
        pinchStart.current = null
        return
      }
      const distance = getDistance(e.touches)
      if (distance === 0) return
      pinchStart.current = { distance, scale: pinchScaleRef.current }
      e.preventDefault()
    }

    const onTouchMove = (e: TouchEvent) => {
      if (!pinchStart.current || e.touches.length !== 2) return
      const distance = getDistance(e.touches)
      if (distance === 0) return
      const next = Math.min(Math.max(pinchStart.current.scale * (distance / pinchStart.current.distance), 0.25), 4)
      setPinchScale(next)
      e.preventDefault()
    }

    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) pinchStart.current = null
    }

    el.addEventListener('touchstart', onTouchStart, { passive: false })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', onTouchEnd)
    el.addEventListener('touchcancel', onTouchEnd)

    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
      el.removeEventListener('touchcancel', onTouchEnd)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    loadTemplate(templateId).then((t) => {
      if (!cancelled) setTemplate(t ?? null)
    })
    return () => { cancelled = true }
  }, [templateId])

  const visibleSections = sectionOrder.filter((s) => {
    if (s.type === 'personalInfo') return true
    return sectionVisibility[s.type]
  })

  const measureContent = useCallback(() => {
    Sentry.startSpan({ name: 'Measure Resume Content', op: 'dom.measure' }, (span) => {
      if (!measureRef.current) return
      const el = measureRef.current
      const height = el.scrollHeight
      setTotalContentHeight(height)
      span.setAttribute('content.height', height)

      const sections = el.querySelectorAll<HTMLElement>('[data-section]')
      const sectionData: { top: number; height: number }[] = []
      sections.forEach((s) => {
        const top = (s as HTMLElement).offsetTop
        const height = (s as HTMLElement).offsetHeight
        if (height > 0) sectionData.push({ top, height })
      })
      setSectionBounds(sectionData)
      span.setAttribute('section.count', sectionData.length)
    })
  }, [])

  useEffect(() => {
    const timer = setTimeout(measureContent, 150)
    return () => clearTimeout(timer)
  }, [resume, sectionOrder, sectionVisibility, templateId, measureContent])

  useEffect(() => {
    const onResize = () => setViewport({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  function toggleFullscreen() {
    if (onToggleFullscreen) {
      onToggleFullscreen()
    } else {
      setInternalFullscreen((v) => !v)
    }
  }

  useEffect(() => {
    if (!isFullscreen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') toggleFullscreen()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isFullscreen, onToggleFullscreen])

  const totalScaledHeight = numberOfPages * A4_HEIGHT_PX + (numberOfPages - 1) * 16
  const [fitScale, setFitScale] = useState(1)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const recompute = () => {
      const tsh = numberOfPages * A4_HEIGHT_PX + (numberOfPages - 1) * 16
      const fs = Math.min(Math.max((el.clientWidth - 32) / A4_WIDTH_PX, 0), Math.max((el.clientHeight - 32) / tsh, 0), 1.5)
      setFitScale(fs || 1)
    }
    const raf = requestAnimationFrame(recompute)
    const observer = new ResizeObserver(recompute)
    observer.observe(el)
    return () => { cancelAnimationFrame(raf); observer.disconnect() }
  }, [numberOfPages])
  const baseScale = isFullscreen
    ? zoom === 'fit'
      ? Math.min((viewport.w - 40) / A4_WIDTH_PX, (viewport.h - 40) / totalScaledHeight, 1.5)
      : scale
    : zoom === 'fit' ? fitScale : scale
  const displayScale = Math.min(Math.max(baseScale * pinchScale, 0.25), 4)

  function cycleZoom(direction: 'in' | 'out') {
    if (direction === 'in') {
      if (zoom === 'fit') {
        setZoom(100)
      } else {
        const currentIdx = zoomLevels.indexOf(zoom)
        if (currentIdx < zoomLevels.length - 1) {
          setZoom(zoomLevels[currentIdx + 1])
        }
      }
    } else {
      if (zoom === 'fit') return
      const currentIdx = zoomLevels.indexOf(zoom)
      if (currentIdx > 0) {
        setZoom(zoomLevels[currentIdx - 1])
      } else {
        setZoom('fit')
      }
    }
  }

  const renderPageContent = () => (
    <>
      {template ? (
        <template.Preview resume={resume} sections={visibleSections} />
      ) : (
        <div className="flex items-center justify-center h-full text-gray-400 text-xs">
          Select a template
        </div>
      )}
    </>
  )

  const renderSinglePage = (pageNum: number) => {
    const contentOffset = pageOffsets[pageNum - 1] ?? 0

    return (
      <div
        key={pageNum}
        className="bg-white text-black relative"
        style={{
          width: A4_WIDTH_PX,
          height: A4_HEIGHT_PX,
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: margins.top * MM_TO_PX,
            left: margins.left * MM_TO_PX,
            right: margins.right * MM_TO_PX,
            bottom: margins.bottom * MM_TO_PX,
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'relative', top: -contentOffset }}>
            {renderPageContent()}
          </div>
        </div>
      </div>
    )
  }

  const a4Content = (
    <div ref={pageRef} className="flex flex-col gap-4">
      {Array.from({ length: numberOfPages }, (_, i) => renderSinglePage(i + 1))}
    </div>
  )

  return (
    <>
      <div className="flex flex-col h-full">
        {!hideToolbar && (
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-background/95 backdrop-blur">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[10px] text-muted-foreground">A4 Page Preview</span>
              <span className="text-[9px] text-muted-foreground italic">(approximate)</span>
              {isOverflowing && (
                <span className="inline-flex items-center gap-1 text-[10px] text-amber-600">
                  <AlertTriangle className="h-3 w-3" />
                  {numberOfPages} pages
                </span>
              )}
            </div>
            <div className="flex items-center gap-0.5">
              <Button variant="ghost" size="icon-xs" className="size-7 sm:size-5" onClick={() => cycleZoom('out')} disabled={zoom === 50} aria-label="Zoom out">
                <ZoomOut className="h-3 w-3" />
              </Button>
              <Select value={String(zoom)} onValueChange={(v) => setZoom(v === 'fit' ? 'fit' : Number(v) as ZoomLevel)}>
                <SelectTrigger className="text-[10px] h-6 px-1.5 py-0.5 gap-1 cursor-pointer min-w-0" aria-label="Zoom level">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="min-w-16 text-[10px]">
                  {zoomLevels.map((z) => (<SelectItem key={z} value={String(z)} className="py-0.5 pr-6 pl-1.5 text-[10px]">{z}%</SelectItem>))}
                  <SelectItem key="fit" value="fit" className="py-0.5 pr-6 pl-1.5 text-[10px]">Fit</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="ghost" size="icon-xs" className="size-7 sm:size-5" onClick={() => cycleZoom('in')} disabled={zoom === 150} aria-label="Zoom in">
                <ZoomIn className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon-xs" className="size-7 sm:size-5" onClick={toggleFullscreen} aria-label="Full screen">
                <Maximize className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
        <div
          ref={containerRef}
          className={`flex-1 min-h-0 overflow-auto p-4 ${showGrabbing ? 'cursor-grabbing' : 'cursor-grab'}`}
        >
            <div
              style={{
                width: A4_WIDTH_PX * displayScale + 16 * displayScale,
                height: totalScaledHeight * displayScale,
                flexShrink: 0,
                margin: '0 auto',
              }}
            >
              <div style={{ transform: `scale(${displayScale})`, transformOrigin: 'top left', width: A4_WIDTH_PX }}>
                {a4Content}
              </div>
            </div>
        </div>
      </div>

      {/* Hidden measurement container - matches page structure exactly */}
      <div
        ref={measureRef}
        style={{
          position: 'absolute',
          left: '-9999px',
          top: 0,
          width: A4_WIDTH_PX - paddingX,
          visibility: 'hidden',
        }}
      >
        {renderPageContent()}
      </div>

      {isFullscreen && externalFullscreen === undefined && (
        <div className="fixed inset-0 z-[100] bg-gray-900 overflow-auto p-4" style={{ overscrollBehavior: 'contain' }}>
            <div
              style={{
                width: A4_WIDTH_PX * displayScale,
                height: totalScaledHeight * displayScale,
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  transform: `scale(${displayScale})`,
                  transformOrigin: 'top left',
                  width: A4_WIDTH_PX,
                }}
              >
                {a4Content}
              </div>
            </div>
          <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
            <Button
              variant="secondary"
              size="icon"
              className="h-12 w-12 rounded-full shadow-lg bg-background/90 backdrop-blur"
              onClick={() => cycleZoom('in')}
              disabled={zoom === 150}
              aria-label="Zoom in"
            >
              <ZoomIn className="h-5 w-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-12 w-12 rounded-full shadow-lg bg-background/90 backdrop-blur"
              onClick={() => cycleZoom('out')}
              disabled={zoom === 50}
              aria-label="Zoom out"
            >
              <ZoomOut className="h-5 w-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-12 w-12 rounded-full shadow-lg bg-background/90 backdrop-blur"
              onClick={() => setZoom('fit')}
              aria-label="Fit to screen"
            >
              <Maximize className="h-5 w-5" />
            </Button>
          </div>
          <button
            onClick={toggleFullscreen}
            className="fixed top-4 right-4 z-[100] flex items-center justify-center w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors shadow-lg"
            aria-label="Back"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
    </>
  )
}
