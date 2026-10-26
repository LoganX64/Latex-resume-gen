import * as Sentry from "@sentry/react";
import { isChunkLoadError } from "@/lib/preload-error-handler";
import React from "react";
import {
  useLocation,
  useNavigationType,
  createRoutesFromChildren,
  matchRoutes,
} from "react-router-dom";

// `navigator.webdriver` is true under Puppeteer. The prerender step loads this
// production bundle in headless Chromium, so without this guard every prerender
// pass would report a synthetic session, replay, and any render errors.
if (import.meta.env.PROD && !navigator.webdriver) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    release: import.meta.env.VITE_SENTRY_RELEASE,

    integrations: [
      Sentry.reactRouterBrowserTracingIntegration({
        useEffect: React.useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes,
        enableInp: true,
        enableLongTask: true,
      }),

      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),

      Sentry.feedbackIntegration({
        colorScheme: "system",
        autoInject: false,
      }),

      Sentry.thirdPartyErrorFilterIntegration({
        filterKeys: ["latex-resume"],
        behaviour: "drop-error-if-exclusively-contains-third-party-frames",
      }),
    ],

    enableLogs: false,

    tracesSampleRate: 0.1,

    tracePropagationTargets: ["localhost", /^\//],

    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1.0,

    environment: import.meta.env.PROD ? 'production' : import.meta.env.MODE,

    ignoreErrors: [
      // Filter out CefSharp bot/scanner IPC rejections (e.g., Outlook SafeLinks, Defender, anti-detect crawlers)
      /Object Not Found Matching Id/i,
      // Benign browser layout-loop warning that is not actionable in application code
      /ResizeObserver loop (limit exceeded|completed with undelivered notifications)/i,
    ],

    beforeSend(event, hint) {
      if (isChunkLoadError(hint.originalException)) {
        event.tags = { ...event.tags, kind: 'chunk-load' };
      }
      return event;
    },
  });
}
