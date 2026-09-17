export interface RepetitionState {
  intervalDays: number;
  ease: number;
  repetitions: number;
}

export function scheduleNextReview(state: RepetitionState, quality: 0 | 1 | 2 | 3 | 4 | 5): RepetitionState {
  const ease = Math.max(1.3, state.ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
  if (quality < 3) return { intervalDays: 1, ease, repetitions: 0 };
  const repetitions = state.repetitions + 1;
  const intervalDays = repetitions === 1 ? 1 : repetitions === 2 ? 6 : Math.max(1, Math.round(state.intervalDays * ease));
  return { intervalDays, ease, repetitions };
}
