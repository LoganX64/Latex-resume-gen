import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { useResumeStore } from '@/stores/resume-store'
import { Upload, X, User } from 'lucide-react'
import Cropper from 'react-easy-crop'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

export function ProfileImageUpload() {
  const profileImage = useResumeStore((s) => s.resume.personalInfo.profileImage)
  const updatePersonalInfo = useResumeStore((s) => s.updatePersonalInfo)
  const removeProfileImage = useResumeStore((s) => s.removeProfileImage)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [cropDialogOpen, setCropDialogOpen] = useState(false)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    x: number
    y: number
    width: number
    height: number
  } | null>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setImageSrc(reader.result as string)
      setCropDialogOpen(true)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  function onCropComplete(_croppedArea: unknown, croppedAreaPixels: { x: number; y: number; width: number; height: number }) {
    setCroppedAreaPixels(croppedAreaPixels)
  }

  async function getCroppedImg() {
    if (!imageSrc || !croppedAreaPixels) return
    const image = new Image()
    image.src = imageSrc
    await new Promise((resolve) => {
      image.onload = resolve
    })
    const canvas = document.createElement('canvas')
    canvas.width = croppedAreaPixels.width
    canvas.height = croppedAreaPixels.height
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    )
    const croppedImage = canvas.toDataURL('image/png')
    updatePersonalInfo('profileImage', croppedImage)
    setCropDialogOpen(false)
    setImageSrc(null)
  }

  function removeImage() {
    removeProfileImage()
  }

  return (
    <div className="flex flex-col items-center gap-2 shrink-0">
      <div className="relative w-20 h-20">
        <div className="w-full h-full rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center overflow-hidden bg-muted">
          {profileImage ? (
            <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <User className="h-8 w-8 text-muted-foreground/50" aria-hidden="true" />
          )}
        </div>
        {profileImage && (
          <button
            onClick={removeImage}
            aria-label="Remove profile photo"
            className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 hover:bg-destructive/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        aria-label="Upload profile photo"
      />
      <Button
        variant="outline"
        size="sm"
        className="h-7 text-[10px]"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="h-3 w-3 mr-1" aria-hidden="true" />
        Upload Photo
      </Button>

      <Dialog open={cropDialogOpen} onOpenChange={setCropDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Crop Profile Photo</DialogTitle>
          </DialogHeader>
          <div className="relative h-64 w-full bg-muted rounded-md overflow-hidden">
            {imageSrc && (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            )}
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="crop-zoom" className="text-xs text-muted-foreground">Zoom</label>
            <input
              id="crop-zoom"
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setCropDialogOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={getCroppedImg}>
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
