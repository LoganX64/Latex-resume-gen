import * as Sentry from "@sentry/react";
import React from "react";
import {
  useLocation,
  useNavigationType,
  createRoutesFromChildren,
  matchRoutes,
} from "react-router-dom";

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,

    integrations: [
      Sentry.reactRouterBrowserTracingIntegration({
        useEffect: React.useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes,
        enableInp: true,
        enableLongTask: true,
        interactionsSampleRate: 1.0,
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
}
