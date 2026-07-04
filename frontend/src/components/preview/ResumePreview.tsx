import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useResumeStore } from '@/stores/resume-store'
import { getTemplate } from '@/templates'
import { AlertTriangle, Maximize, ZoomIn, ZoomOut } from 'lucide-react'
import type { ZoomLevel } from '@/types/resume'

const A4_WIDTH_MM = 210
const A4_HEIGHT_MM = 297
const MM_TO_PX = 3.7795275591
const A4_WIDTH_PX = Math.round(A4_WIDTH_MM * MM_TO_PX)
const A4_HEIGHT_PX = Math.round(A4_HEIGHT_MM * MM_TO_PX)
const PREVIEW_PADDING_TOP_MM = 15
const PREVIEW_PADDING_BOTTOM_MM = 15
const PREVIEW_PADDING_LEFT_MM = 12
const PREVIEW_PADDING_RIGHT_MM = 12

const zoomLevels: ZoomLevel[] = [50, 75, 100, 125, 150]

export function ResumePreview() {
  const zoom = useResumeStore((s) => s.zoom)
  const setZoom = useResumeStore((s) => s.setZoom)
  const resume = useResumeStore((s) => s.resume)
  const sectionOrder = useResumeStore((s) => s.sectionOrder)
  const sectionVisibility = useResumeStore((s) => s.sectionVisibility)
  const templateId = useResumeStore((s) => s.templateId)
  const pageRef = useRef<HTMLDivElement>(null)
  const [isOverflowing, setIsOverflowing] = useState(false)

  const scale = zoom === 'fit' ? 1 : zoom / 100
  const template = getTemplate(templateId)

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

  return (
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
          <select value={zoom} onChange={(e) => { const val = e.target.value; setZoom(val === 'fit' ? 'fit' : Number(val) as ZoomLevel) }} className="text-[10px] bg-transparent border border-border rounded px-1.5 py-0.5 text-foreground cursor-pointer" aria-label="Zoom level">
            {zoomLevels.map((z) => (<option key={z} value={z}>{z}%</option>))}
            <option value="fit">Fit</option>
          </select>
          <Button variant="ghost" size="icon-xs" onClick={() => cycleZoom('in')} disabled={zoom === 150} aria-label="Zoom in">
            <ZoomIn className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon-xs" onClick={() => setZoom('fit')} aria-label="Fit to width">
            <Maximize className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <div className="flex items-start justify-center min-h-full">
          <div style={{ transform: `scale(${scale})`, transformOrigin: 'top center', width: A4_WIDTH_PX }}>
            <div
              ref={pageRef}
              className={`bg-white text-black relative overflow-hidden ${isOverflowing ? 'ring-2 ring-red-500' : ''}`}
              style={{
                width: A4_WIDTH_PX,
                height: A4_HEIGHT_PX,
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                padding: `${PREVIEW_PADDING_TOP_MM * MM_TO_PX}px ${PREVIEW_PADDING_RIGHT_MM * MM_TO_PX}px ${PREVIEW_PADDING_BOTTOM_MM * MM_TO_PX}px ${PREVIEW_PADDING_LEFT_MM * MM_TO_PX}px`,
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
  )
}
