import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useResumeStore } from '@/stores/resume-store'
import { getTemplate } from '@/templates'
import { AlertTriangle, Maximize, X, ZoomIn, ZoomOut } from 'lucide-react'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import type { ZoomLevel, Margins } from '@/types/resume'

const A4_WIDTH_MM = 210
const A4_HEIGHT_MM = 297
const MM_TO_PX = 3.7795275591
const A4_WIDTH_PX = Math.round(A4_WIDTH_MM * MM_TO_PX)
const A4_HEIGHT_PX = Math.round(A4_HEIGHT_MM * MM_TO_PX)
const DEFAULT_MARGINS: Margins = { top: 7.62, bottom: 7.62, left: 7.62, right: 7.62 }

const zoomLevels: ZoomLevel[] = [50, 75, 100, 125, 150]

export function ResumePreview() {
  const zoom = useResumeStore((s) => s.zoom)
  const setZoom = useResumeStore((s) => s.setZoom)
  const resume = useResumeStore((s) => s.resume)
  const sectionOrder = useResumeStore((s) => s.sectionOrder)
  const sectionVisibility = useResumeStore((s) => s.sectionVisibility)
  const templateId = useResumeStore((s) => s.templateId)
  const pageRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [viewport, setViewport] = useState({ w: window.innerWidth, h: window.innerHeight })
  const isDragging = useRef(false)
  const [showGrabbing, setShowGrabbing] = useState(false)
  const dragStart = useRef({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0, active: false })

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

  const scale = zoom === 'fit' ? 1 : zoom / 100
  const template = getTemplate(templateId)
  const margins = useMemo(() => template?.config?.margins ?? DEFAULT_MARGINS, [template])

  const visibleSections = sectionOrder.filter((s) => {
    if (s.type === 'personalInfo') return true
    return sectionVisibility[s.type]
  })

  const checkOverflow = useCallback(() => {
    if (!pageRef.current) return
    const el = pageRef.current
    setIsOverflowing(el.scrollHeight > el.clientHeight + 5)
  }, [])

  useEffect(() => {
    checkOverflow()
  }, [resume, sectionOrder, sectionVisibility, templateId, checkOverflow])

  useEffect(() => {
    const onResize = () => setViewport({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  function toggleFullscreen() {
    setIsFullscreen((v) => !v)
  }

  const displayScale = isFullscreen
    ? Math.min((viewport.w - 40) / A4_WIDTH_PX, (viewport.h - 40) / A4_HEIGHT_PX, 1.5)
    : scale

  function cycleZoom(direction: 'in' | 'out') {
    const currentIdx = typeof zoom === 'number' ? zoomLevels.indexOf(zoom) : -1
    if (currentIdx === -1) {
      setZoom(direction === 'in' ? 100 : 75)
      return
    }
    if (direction === 'in' && currentIdx < zoomLevels.length - 1) {
      setZoom(zoomLevels[currentIdx + 1])
    } else if (direction === 'out' && currentIdx > 0) {
      setZoom(zoomLevels[currentIdx - 1])
    }
  }

  const a4Content = (
    <div
      ref={pageRef}
      className="bg-white text-black relative overflow-hidden"
      style={{
        width: A4_WIDTH_PX,
        height: A4_HEIGHT_PX,
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        padding: `${margins.top * MM_TO_PX}px ${margins.right * MM_TO_PX}px ${margins.bottom * MM_TO_PX}px ${margins.left * MM_TO_PX}px`,
      }}
    >
      {template ? (
        <template.Preview resume={resume} sections={visibleSections} />
      ) : (
        <div className="flex items-center justify-center h-full text-gray-400 text-xs">
          Select a template
        </div>
      )}
    </div>
  )

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-background/95 backdrop-blur">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[10px] text-muted-foreground">A4 HTML Preview</span>
            {isOverflowing && (
              <span className="inline-flex items-center gap-1 text-[10px] text-red-600">
                <AlertTriangle className="h-3 w-3" />
                Exceeds one page
              </span>
            )}
          </div>
          <div className="flex items-center gap-0.5">
            <Button variant="ghost" size="icon-xs" onClick={() => cycleZoom('out')} disabled={zoom === 50} aria-label="Zoom out">
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
            <Button variant="ghost" size="icon-xs" onClick={() => cycleZoom('in')} disabled={zoom === 150} aria-label="Zoom in">
              <ZoomIn className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon-xs" onClick={toggleFullscreen} aria-label="Full screen">
              <Maximize className="h-3 w-3" />
            </Button>
          </div>
        </div>
        <div
          ref={containerRef}
          className={`flex-1 overflow-auto p-4 ${showGrabbing ? 'cursor-grabbing' : 'cursor-grab'}`}
          style={{ touchAction: 'manipulation' }}
        >
          <div className="flex items-start min-h-full">
            <div
              style={{
                width: A4_WIDTH_PX * scale + 16 * scale,
                height: A4_HEIGHT_PX * scale + 16 * scale + (isOverflowing ? 48 * scale : 0),
                marginLeft: scale <= 1 ? 'auto' : undefined,
                marginRight: scale <= 1 ? 'auto' : undefined,
                flexShrink: 0,
              }}
            >
              <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: A4_WIDTH_PX }}>
                {a4Content}
                {isOverflowing && (
                  <div className="mt-3 flex items-start gap-2 rounded border border-red-200 bg-red-50 px-3 py-2 text-[11px] leading-snug text-red-700">
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    This preview exceeds one A4 page. Shorten content or hide sections before downloading.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-gray-900 flex items-center justify-center" style={{ overscrollBehavior: 'contain' }}>
          <div
            style={{
              transform: `scale(${displayScale})`,
              transformOrigin: 'center center',
            }}
          >
            {a4Content}
          </div>
          <button
            onClick={toggleFullscreen}
            className="fixed top-4 right-4 z-50 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Back"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
    </>
  )
}
