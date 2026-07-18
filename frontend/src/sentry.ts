import * as Sentry from "@sentry/react";
import React from "react";
import {
  useLocation,
  useNavigationType,
  createRoutesFromChildren,
  matchRoutes,
} from "react-router-dom";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,

  integrations: [
    Sentry.reactRouterBrowserTracingIntegration({
      useEffect: React.useEffect,
      useLocation,
      useNavigationType,
      createRoutesFromChildren,
      matchRoutes,
    }),

    Sentry.replayIntegration(),

    Sentry.feedbackIntegration({
      colorScheme: "system",
    }),
  ],

  enableLogs: true,

  tracesSampleRate: 1.0,

  tracePropagationTargets: ["localhost", /^\//],

  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  environment: import.meta.env.MODE,
});
