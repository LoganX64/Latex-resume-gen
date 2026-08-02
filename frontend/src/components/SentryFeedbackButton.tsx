import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import * as Sentry from '@sentry/react'

export function SentryFeedbackButton() {
  const location = useLocation()

  useEffect(() => {
    if (location.pathname !== '/') return

    const feedback = Sentry.getFeedback()
    if (!feedback) return

    const widget = feedback.createWidget()
    widget.appendToDom()

    return () => {
      widget.removeFromDom()
    }
  }, [location.pathname])

  return null
}
