import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MonthPicker } from '@/components/ui/month-picker'
import { Textarea } from '@/components/ui/textarea'
import { useResumeStore } from '@/stores/resume-store'
import { Plus, Trash2 } from 'lucide-react'

export function PublicationsForm() {
  const publications = useResumeStore((s) => s.resume.publications)
  const addPublication = useResumeStore((s) => s.addPublication)
  const updatePublication = useResumeStore((s) => s.updatePublication)
  const removePublication = useResumeStore((s) => s.removePublication)

  return (
    <div className="space-y-3">
      {publications.map((pub, index) => (
        <Card key={pub.id}>
          <CardContent className="p-3 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium text-muted-foreground flex-1">
              Publication {index + 1}
            </span>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => removePublication(pub.id)}
              aria-label={`Remove publication ${index + 1}`}
            >
              <Trash2 className="h-3 w-3 text-destructive" />
            </Button>
          </div>
          <div className="space-y-1">
            <Label htmlFor={`pub-title-${pub.id}`} className="text-[10px]">Title *</Label>
            <Input
              id={`pub-title-${pub.id}`}
              name="pubTitle"
              autoComplete="off"
              value={pub.title}
              onChange={(e) => updatePublication(pub.id, 'title', e.target.value)}
              placeholder="Research paper or article title"
              className="h-7 text-xs"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label htmlFor={`pub-publisher-${pub.id}`} className="text-[10px]">Publisher *</Label>
              <Input
                id={`pub-publisher-${pub.id}`}
                name="pubPublisher"
                autoComplete="organization"
                value={pub.publisher}
                onChange={(e) => updatePublication(pub.id, 'publisher', e.target.value)}
                placeholder="IEEE / ACM"
                className="h-7 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor={`pub-date-${pub.id}`} className="text-[10px]">Date *</Label>
              <MonthPicker
                id={`pub-date-${pub.id}`}
                value={pub.date}
                onValueChange={(val) => updatePublication(pub.id, 'date', val)}
                className="h-7 text-xs"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label htmlFor={`pub-url-${pub.id}`} className="text-[10px]">URL</Label>
              <Input
                id={`pub-url-${pub.id}`}
                name="pubUrl"
                autoComplete="url"
                value={pub.url}
                onChange={(e) => updatePublication(pub.id, 'url', e.target.value)}
                placeholder="https://…"
                type="url"
                inputMode="url"
                className="h-7 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor={`pub-desc-${pub.id}`} className="text-[10px]">Description</Label>
              <Textarea
                id={`pub-desc-${pub.id}`}
                name="pubDescription"
                value={pub.description}
                onChange={(e) => updatePublication(pub.id, 'description', e.target.value)}
                placeholder="Brief description…"
                className="min-h-[40px] text-xs resize-y"
              />
            </div>
          </div>
          </CardContent>
        </Card>
      ))}
      <Button
        variant="outline"
        size="sm"
        className="h-7 text-xs w-full"
        onClick={addPublication}
      >
        <Plus className="h-3 w-3 mr-1" aria-hidden="true" />
        Add Publication
      </Button>
    </div>
  )
}
