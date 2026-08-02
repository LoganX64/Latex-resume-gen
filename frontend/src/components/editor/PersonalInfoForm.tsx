import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useResumeStore } from '@/stores/resume-store'
import { ProfileImageUpload } from './ProfileImageUpload'

export function PersonalInfoForm() {
  const personalInfo = useResumeStore((s) => s.resume.personalInfo)
  const updatePersonalInfo = useResumeStore((s) => s.updatePersonalInfo)

  return (
    <Card>
      <CardHeader className="py-2 px-3">
        <CardTitle className="text-sm font-medium">Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="px-3 pb-3 pt-0">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="text-sm sm:text-[11px]">Full Name *</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  autoComplete="name"
                  value={personalInfo.fullName}
                  onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                  placeholder="John Doe…"
                  className="h-10 text-base sm:h-8 sm:text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="professionalTitle" className="text-sm sm:text-[11px]">Professional Title</Label>
                <Input
                  id="professionalTitle"
                  name="professionalTitle"
                  autoComplete="organization-title"
                  value={personalInfo.professionalTitle ?? ''}
                  onChange={(e) => updatePersonalInfo('professionalTitle', e.target.value)}
                  placeholder="Senior Software Engineer…"
                  className="h-10 text-base sm:h-8 sm:text-xs"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm sm:text-[11px]">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  spellCheck={false}
                  value={personalInfo.email}
                  onChange={(e) => updatePersonalInfo('email', e.target.value)}
                  placeholder="john@example.com…"
                  className="h-10 text-base sm:h-8 sm:text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-sm sm:text-[11px]">Phone *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={personalInfo.phone}
                  onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                  placeholder="+1 234 567 890…"
                  className="h-10 text-base sm:h-8 sm:text-xs"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="location" className="text-sm sm:text-[11px]">Location *</Label>
                <Input
                  id="location"
                  name="location"
                  autoComplete="address-level1"
                  value={personalInfo.location}
                  onChange={(e) => updatePersonalInfo('location', e.target.value)}
                  placeholder="San Francisco, CA…"
                  className="h-10 text-base sm:h-8 sm:text-xs"
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="linkedin" className="text-sm sm:text-[11px]">LinkedIn</Label>
                <Input
                  id="linkedin"
                  name="linkedin"
                  type="url"
                  inputMode="url"
                  autoComplete="url"
                  value={personalInfo.linkedin ?? ''}
                  onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                  placeholder="linkedin.com/in/johndoe…"
                  className="h-10 text-base sm:h-8 sm:text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="github" className="text-sm sm:text-[11px]">GitHub</Label>
                <Input
                  id="github"
                  name="github"
                  type="url"
                  inputMode="url"
                  autoComplete="url"
                  value={personalInfo.github ?? ''}
                  onChange={(e) => updatePersonalInfo('github', e.target.value)}
                  placeholder="github.com/johndoe…"
                  className="h-10 text-base sm:h-8 sm:text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="website" className="text-sm sm:text-[11px]">Website</Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  inputMode="url"
                  autoComplete="url"
                  value={personalInfo.website ?? ''}
                  onChange={(e) => updatePersonalInfo('website', e.target.value)}
                  placeholder="johndoe.dev…"
                  className="h-10 text-base sm:h-8 sm:text-xs"
                />
              </div>
            </div>
          </div>
          <ProfileImageUpload />
        </div>
      </CardContent>
    </Card>
  )
}
