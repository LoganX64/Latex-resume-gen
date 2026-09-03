import { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import * as Sentry from '@sentry/react'
import { Toaster } from '@/components/ui/sonner'
import { useIsMobile } from '@/hooks/use-mobile'
import { SentryFeedbackButton } from '@/components/SentryFeedbackButton'
import { PageTransition } from '@/components/motion/PageTransition'

const HomePage = lazy(() => import('@/pages/HomePage'))
const MainLayout = lazy(() => import('@/layouts/MainLayout'))
const MobileLayout = lazy(() => import('@/layouts/MobileLayout'))
const StatsDashboard = lazy(() => import('@/pages/StatsDashboard'))

const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes)

function EditorRoute() {
  const isMobile = useIsMobile()
  return isMobile ? <MobileLayout /> : <MainLayout />
}

function AppRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait" initial={false}>
      <SentryRoutes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <HomePage />
            </PageTransition>
          }
        />
        <Route
          path="/editor"
          element={
            <PageTransition>
              <EditorRoute />
            </PageTransition>
          }
        />
        <Route
          path="/admin/stats"
          element={
            <PageTransition>
              <StatsDashboard />
            </PageTransition>
          }
        />
      </SentryRoutes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <>
      <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading…</div>}>
        <SentryFeedbackButton />
        <AppRoutes />
      </Suspense>
      <Toaster position="top-center" richColors />
    </>
  )
}

export default App
