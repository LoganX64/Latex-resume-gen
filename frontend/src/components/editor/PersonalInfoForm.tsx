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
        <div className="flex gap-4">
          <div className="flex-1 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="text-xs">Full Name *</Label>
                <Input
                  id="fullName"
                  value={personalInfo.fullName}
                  onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                  placeholder="John Doe"
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="professionalTitle" className="text-xs">Professional Title</Label>
                <Input
                  id="professionalTitle"
                  value={personalInfo.professionalTitle}
                  onChange={(e) => updatePersonalInfo('professionalTitle', e.target.value)}
                  placeholder="Senior Software Engineer"
                  className="h-8 text-xs"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={personalInfo.email}
                  onChange={(e) => updatePersonalInfo('email', e.target.value)}
                  placeholder="john@example.com"
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs">Phone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  value={personalInfo.phone}
                  onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                  placeholder="+1 234 567 890"
                  className="h-8 text-xs"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="location" className="text-xs">Location *</Label>
              <Input
                id="location"
                value={personalInfo.location}
                onChange={(e) => updatePersonalInfo('location', e.target.value)}
                placeholder="San Francisco, CA"
                className="h-8 text-xs"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="linkedin" className="text-xs">LinkedIn</Label>
                <Input
                  id="linkedin"
                  type="url"
                  inputMode="url"
                  value={personalInfo.linkedin}
                  onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                  placeholder="linkedin.com/in/johndoe"
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="github" className="text-xs">GitHub</Label>
                <Input
                  id="github"
                  type="url"
                  inputMode="url"
                  value={personalInfo.github}
                  onChange={(e) => updatePersonalInfo('github', e.target.value)}
                  placeholder="github.com/johndoe"
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="website" className="text-xs">Website</Label>
                <Input
                  id="website"
                  type="url"
                  inputMode="url"
                  value={personalInfo.website}
                  onChange={(e) => updatePersonalInfo('website', e.target.value)}
                  placeholder="johndoe.dev"
                  className="h-8 text-xs"
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
