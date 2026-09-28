import "./sentry";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import * as Sentry from '@sentry/react'
import './index.css'
import App from './App'
import { ThemeProvider } from '@/components/theme-provider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { LazyMotionProvider } from '@/components/motion/LazyMotionProvider'
import { installPreloadErrorHandler } from '@/lib/preload-error-handler'
import { ChunkLoadErrorBoundary } from '@/components/ChunkLoadErrorBoundary'

installPreloadErrorHandler()

const root = createRoot(document.getElementById('root')!, {
  onUncaughtError: Sentry.reactErrorHandler((error, errorInfo) => {
    console.warn("Uncaught error", error, errorInfo.componentStack);
  }),
  onCaughtError: Sentry.reactErrorHandler(),
  onRecoverableError: Sentry.reactErrorHandler(),
});

root.render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <TooltipProvider>
          <LazyMotionProvider>
            <ChunkLoadErrorBoundary>
              <App />
            </ChunkLoadErrorBoundary>
          </LazyMotionProvider>
        </TooltipProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
