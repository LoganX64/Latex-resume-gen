import { Link } from 'react-router-dom'
import { useVersionsStore } from '@/stores/versions-store'
import { VersionCard } from '@/components/VersionCard'
import { StorageWarning } from '@/components/StorageWarning'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import {
  FileText,
  Image,
  Download,
  Code2,
  ArrowRight,
  Plus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const features = [
  {
    icon: FileText,
    title: 'Single Page Resumes',
    description: 'Built-in compression keeps your resume professional and concise on one page.',
  },
  {
    icon: Image,
    title: 'Photo Support',
    description: 'Upload and crop a profile photo. Supported by sidebar and engineering templates.',
  },
  {
    icon: Download,
    title: 'LaTeX PDF Export',
    description: 'Compile LaTeX to PDF with Tectonic for publication-quality typesetting.',
  },
  {
    icon: Code2,
    title: 'LaTeX Download',
    description: 'Download the raw .tex source file to customize in Overleaf or any LaTeX editor.',
  },
]

export default function HomePage() {
  const versions = useVersionsStore((s) => s.versions)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            LaTeX Resume Generator
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Create professional, ATS-friendly resumes with LaTeX-quality typesetting.
            Single-page design, photo support, and instant PDF export.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link to="/editor">
              <Button size="lg">
                Build Resume
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-2xl font-bold text-center mb-10">Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => (
            <Card key={f.title} className="text-center">
              <CardContent className="pt-6 pb-5 px-4">
                <f.icon className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                <h3 className="font-semibold text-sm mb-1">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {f.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Saved Versions */}
      <section className="mx-auto max-w-5xl px-6 py-16 border-t">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Your Resumes</h2>
          <Link to="/editor">
            <Button size="default">
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              New Resume
            </Button>
          </Link>
        </div>

        <StorageWarning className="mb-6" />

        {versions.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <FileText className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No saved resumes yet.</p>
            <p className="text-xs mt-1">
              Build a resume and save it as a version to see it here.
            </p>
            <Link to="/editor" className="mt-4 inline-block">
              <Button variant="outline" size="default">
                Build Your First Resume
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {versions.map((v) => (
              <VersionCard key={v.id} version={v} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  )
}
