import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import * as Sentry from '@sentry/react'
import { Toaster } from '@/components/ui/sonner'

const HomePage = lazy(() => import('@/pages/HomePage'))
const MainLayout = lazy(() => import('@/layouts/MainLayout'))
const StatsDashboard = lazy(() => import('@/pages/StatsDashboard'))

const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes)

function App() {
  return (
    <>
      <SentryRoutes>
        <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading…</div>}>
          <Route path="/" element={<HomePage />} />
          <Route path="/editor" element={<MainLayout />} />
          <Route path="/admin/stats" element={<StatsDashboard />} />
        </Suspense>
      </SentryRoutes>
      <Toaster position="bottom-right" richColors />
    </>
  )
}

export default App
