import { Routes, Route } from 'react-router-dom'
import * as Sentry from '@sentry/react'
import { HomePage } from '@/pages/HomePage'
import { MainLayout } from '@/layouts/MainLayout'
import { StatsDashboard } from '@/pages/StatsDashboard'
import { Toaster } from '@/components/ui/sonner'

const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes)

function App() {
  return (
    <>
      <SentryRoutes>
        <Route path="/" element={<HomePage />} />
        <Route path="/editor" element={<MainLayout />} />
        <Route path="/admin/stats" element={<StatsDashboard />} />
      </SentryRoutes>
      <Toaster position="bottom-right" richColors />
    </>
  )
}

export default App
