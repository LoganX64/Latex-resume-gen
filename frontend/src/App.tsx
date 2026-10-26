import { Suspense } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import * as Sentry from '@sentry/react'
import { Analytics } from '@vercel/analytics/react'
import { Toaster } from '@/components/ui/sonner'
import { SentryFeedbackButton } from '@/components/SentryFeedbackButton'
import { PageTransition } from '@/components/motion/PageTransition'
import { LoadingScreen } from '@/components/LoadingScreen'

import { lazyWithRetry } from '@/lib/preload-error-handler'

const HomePageV2 = lazyWithRetry(() => import('@/pages/HomePageV2'))
const EditorV2Layout = lazyWithRetry(() => import('@/layouts/EditorV2Layout'))
const StatsDashboard = lazyWithRetry(() => import('@/pages/StatsDashboard'))
const NotFoundPage = lazyWithRetry(() => import('@/pages/NotFoundPage'))

const SentryRoutes = Sentry.wrapReactRouterRouting(Routes)

function AppRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait" initial={false}>
      <SentryRoutes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <HomePageV2 />
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
        <Route path="/v2" element={<Navigate to="/" replace />} />
        <Route path="/editor-v2" element={<Navigate to="/editor" replace />} />
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
