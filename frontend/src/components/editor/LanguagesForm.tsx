import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useResumeStore } from '@/stores/resume-store'
import { Plus, Trash2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function LanguagesForm() {
  const languages = useResumeStore((s) => s.resume.languages)
  const addLanguage = useResumeStore((s) => s.addLanguage)
  const updateLanguage = useResumeStore((s) => s.updateLanguage)
  const removeLanguage = useResumeStore((s) => s.removeLanguage)

  return (
    <div className="space-y-3">
      {languages.map((lang, index) => (
        <Card key={lang.id}>
          <CardContent className="p-3 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium text-muted-foreground flex-1">
              Language {index + 1}
            </span>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => removeLanguage(lang.id)}
              aria-label={`Remove language ${index + 1}`}
            >
              <Trash2 className="h-3 w-3 text-destructive" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label htmlFor={`lang-name-${lang.id}`} className="text-[10px]">Language *</Label>
              <Input
                id={`lang-name-${lang.id}`}
                name="langName"
                autoComplete="off"
                value={lang.name}
                onChange={(e) => updateLanguage(lang.id, 'name', e.target.value)}
                placeholder="English"
                className="h-7 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px]">Proficiency *</Label>
              <Select
                value={lang.proficiency}
                onValueChange={(value) => { if (value) updateLanguage(lang.id, 'proficiency', value) }}
              >
                <SelectTrigger className="h-7 text-xs" aria-label="Proficiency level">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Native">Native</SelectItem>
                  <SelectItem value="Fluent">Fluent</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Basic">Basic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          </CardContent>
        </Card>
      ))}
      <Button
        variant="outline"
        size="sm"
        className="h-7 text-xs w-full"
        onClick={addLanguage}
      >
        <Plus className="h-3 w-3 mr-1" aria-hidden="true" />
        Add Language
      </Button>
    </div>
  )
}
