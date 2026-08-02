import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MonthPicker } from '@/components/ui/month-picker'
import { useResumeStore } from '@/stores/resume-store'
import { Plus, Trash2 } from 'lucide-react'

export function CertificationsForm() {
  const certifications = useResumeStore((s) => s.resume.certifications)
  const addCertification = useResumeStore((s) => s.addCertification)
  const updateCertification = useResumeStore((s) => s.updateCertification)
  const removeCertification = useResumeStore((s) => s.removeCertification)

  return (
    <div className="space-y-3">
      {certifications.map((cert, index) => (
        <Card key={cert.id}>
          <CardContent className="p-3 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium text-muted-foreground flex-1">
              Certification {index + 1}
            </span>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => removeCertification(cert.id)}
              aria-label={`Remove certification ${index + 1}`}
            >
              <Trash2 className="h-3 w-3 text-destructive" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label htmlFor={`cert-name-${cert.id}`} className="text-[10px]">Name *</Label>
              <Input
                id={`cert-name-${cert.id}`}
                name="certName"
                autoComplete="off"
                value={cert.name}
                onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                placeholder="AWS Solutions Architect"
                className="h-10 text-base sm:h-7 sm:text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor={`cert-issuer-${cert.id}`} className="text-[10px]">Issuer *</Label>
              <Input
                id={`cert-issuer-${cert.id}`}
                name="certIssuer"
                autoComplete="organization"
                value={cert.issuer}
                onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                placeholder="Amazon Web Services"
                className="h-10 text-base sm:h-7 sm:text-xs"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label htmlFor={`cert-date-${cert.id}`} className="text-[10px]">Date *</Label>
              <MonthPicker
                id={`cert-date-${cert.id}`}
                value={cert.date}
                onValueChange={(val) => updateCertification(cert.id, 'date', val)}
                className="h-10 text-base sm:h-7 sm:text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor={`cert-url-${cert.id}`} className="text-[10px]">URL</Label>
              <Input
                id={`cert-url-${cert.id}`}
                name="certUrl"
                autoComplete="url"
                value={cert.url}
                onChange={(e) => updateCertification(cert.id, 'url', e.target.value)}
                placeholder="https://…"
                type="url"
                inputMode="url"
                className="h-10 text-base sm:h-7 sm:text-xs"
              />
            </div>
          </div>
          </CardContent>
        </Card>
      ))}
      <Button
        variant="outline"
        size="sm"
        className="h-10 text-base sm:h-7 sm:text-xs w-full"
        onClick={addCertification}
      >
        <Plus className="h-3 w-3 mr-1" aria-hidden="true" />
        Add Certification
      </Button>
    </div>
  )
}
