import { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import * as Sentry from '@sentry/react'
import { Toaster } from '@/components/ui/sonner'
import { SentryFeedbackButton } from '@/components/SentryFeedbackButton'
import { PageTransition } from '@/components/motion/PageTransition'
import { LoadingScreen } from '@/components/LoadingScreen'

const HomePage = lazy(() => import('@/pages/HomePage'))
const EditorV2Layout = lazy(() => import('@/layouts/EditorV2Layout'))
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
              <EditorV2Layout />
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
    </>
  )
}

export default App
