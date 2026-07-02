import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
        <div key={cert.id} className="border rounded-md p-3 space-y-2 bg-card">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium text-muted-foreground flex-1">
              Certification {index + 1}
            </span>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => removeCertification(cert.id)}
            >
              <Trash2 className="h-3 w-3 text-destructive" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-[10px]">Name *</Label>
              <Input
                value={cert.name}
                onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                placeholder="AWS Solutions Architect"
                className="h-7 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px]">Issuer *</Label>
              <Input
                value={cert.issuer}
                onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                placeholder="Amazon Web Services"
                className="h-7 text-xs"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-[10px]">Date *</Label>
              <Input
                type="month"
                value={cert.date}
                onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                className="h-7 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px]">URL</Label>
              <Input
                value={cert.url}
                onChange={(e) => updateCertification(cert.id, 'url', e.target.value)}
                placeholder="https://..."
                className="h-7 text-xs"
              />
            </div>
          </div>
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        className="h-7 text-xs w-full"
        onClick={addCertification}
      >
        <Plus className="h-3 w-3 mr-1" />
        Add Certification
      </Button>
    </div>
  )
}
