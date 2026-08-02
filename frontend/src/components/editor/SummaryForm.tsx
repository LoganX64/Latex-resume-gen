import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useResumeStore } from '@/stores/resume-store'

export function SummaryForm() {
  const summary = useResumeStore((s) => s.resume.summary)
  const updateSummary = useResumeStore((s) => s.updateSummary)

  return (
    <div className="space-y-1.5">
      <Label htmlFor="summary" className="text-sm sm:text-xs">
        Professional Summary
      </Label>
      <Textarea
        id="summary"
        name="summary"
        autoComplete="off"
        value={summary}
        onChange={(e) => updateSummary(e.target.value)}
        placeholder="Experienced software engineer with 5+ years of expertise in full-stack development, specializing in React, Node.js, and cloud infrastructure…"
        className="min-h-[100px] text-base sm:text-xs resize-y py-2"
      />
      <p className="text-[10px] text-muted-foreground">
        {summary.length}/500 characters recommended
      </p>
    </div>
  )
}
