type PendingWait = {
  resolve: (completed: boolean) => void;
  remaining: number;
  startedAt: number;
  timer: number | null;
};

export function createStepClock() {
  let paused = false;
  let disposed = false;
  let pending: PendingWait | null = null;

  const schedule = () => {
    if (!pending) return;
    const wait = pending;
    wait.startedAt = performance.now();
    wait.timer = window.setTimeout(() => {
      if (pending !== wait) return;
      pending = null;
      wait.resolve(true);
    }, wait.remaining);
  };

  return {
    wait(ms: number) {
      return new Promise<boolean>((resolve) => {
        if (disposed) {
          resolve(false);
          return;
        }
        if (pending) {
          pending.resolve(false);
          pending = null;
        }
        pending = { resolve, remaining: ms, startedAt: 0, timer: null };
        if (!paused) schedule();
      });
    },
    setPaused(next: boolean) {
      if (paused === next) return;
      paused = next;
      const wait = pending;
      if (!wait || disposed) return;
      if (paused) {
        if (wait.timer !== null) {
          window.clearTimeout(wait.timer);
          wait.timer = null;
          wait.remaining = Math.max(
            0,
            wait.remaining - (performance.now() - wait.startedAt),
          );
        }
      } else if (wait.timer === null) {
        schedule();
      }
    },
    dispose() {
      disposed = true;
      const wait = pending;
      if (!wait) return;
      if (wait.timer !== null) window.clearTimeout(wait.timer);
      pending = null;
      wait.resolve(false);
    },
  };
}

export type StepClock = ReturnType<typeof createStepClock>;
