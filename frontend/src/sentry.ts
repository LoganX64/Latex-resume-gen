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
      }),

      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),

      Sentry.feedbackIntegration({
        colorScheme: "system",
        autoInject: false,
      }),
    ],

    enableLogs: true,

    tracesSampleRate: 0.2,

    tracePropagationTargets: ["localhost", /^\//],

    replaysSessionSampleRate: 0.05,
    replaysOnErrorSampleRate: 1.0,

    environment: import.meta.env.MODE,
  });
}
