import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import * as Sentry from '@sentry/react'
import { Toaster } from '@/components/ui/sonner'
import { useIsMobile } from '@/hooks/use-mobile'
import { SentryFeedbackButton } from '@/components/SentryFeedbackButton'

const HomePage = lazy(() => import('@/pages/HomePage'))
const MainLayout = lazy(() => import('@/layouts/MainLayout'))
const MobileLayout = lazy(() => import('@/layouts/MobileLayout'))
const StatsDashboard = lazy(() => import('@/pages/StatsDashboard'))

const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes)

function EditorRoute() {
  const isMobile = useIsMobile()
  return isMobile ? <MobileLayout /> : <MainLayout />
}

function App() {
  return (
    <>
      <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading…</div>}>
        <SentryFeedbackButton />
        <SentryRoutes>
          <Route path="/" element={<HomePage />} />
          <Route path="/editor" element={<EditorRoute />} />
          <Route path="/admin/stats" element={<StatsDashboard />} />
        </SentryRoutes>
      </Suspense>
      <Toaster position="top-center" richColors />
    </>
  )
}

export default App
