import { m, useReducedMotion } from 'framer-motion'
import { DURATION, EASE_OUT } from '@/lib/motion'

export function LoadingScreen() {
  const reduce = useReducedMotion()

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-background">
      {reduce ? (
        <>
          <img
            src="/logo.svg"
            alt="CVStack"
            className="h-16 w-16 rounded-xl"
          />
        </>
      ) : (
        <>
          <m.img
            src="/logo.svg"
            alt="CVStack"
            className="h-16 w-16 rounded-xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: DURATION.base, ease: EASE_OUT }}
          />
          <m.div
            className="flex gap-1.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: DURATION.base }}
          >
            {[0, 1, 2].map((i) => (
              <m.span
                key={i}
                className="block h-1.5 w-1.5 rounded-full bg-primary"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </m.div>
        </>
      )}
    </div>
  )
}
