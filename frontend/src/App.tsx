import { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import * as Sentry from '@sentry/react'
import { Analytics } from '@vercel/analytics/react'
import { Toaster } from '@/components/ui/sonner'
import { SentryFeedbackButton } from '@/components/SentryFeedbackButton'
import { PageTransition } from '@/components/motion/PageTransition'
import { LoadingScreen } from '@/components/LoadingScreen'

const HomePage = lazy(() => import('@/pages/HomePage'))
const EditorLayout = lazy(() => import('@/layouts/EditorLayout'))
const StatsDashboard = lazy(() => import('@/pages/StatsDashboard'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes)

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
            <PageTransition disableOnMobile>
              <EditorLayout />
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
        <Route
          path="*"
          element={
            <PageTransition>
              <NotFoundPage />
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
      <Suspense fallback={<LoadingScreen />}>
        <SentryFeedbackButton />
        <AppRoutes />
      </Suspense>
      <Toaster position="top-center" richColors />
      <Analytics />
    </>
  )
}

export default App
