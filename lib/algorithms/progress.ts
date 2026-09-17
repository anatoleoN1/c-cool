export function masteryScore(successRate: number, averageResponseTimeMs: number, attempts: number): number {
  const reliability = Math.min(1, attempts / 10);
  const speed = Math.max(0, Math.min(1, 1 - averageResponseTimeMs / 30000));
  return Math.round((successRate * 0.8 + speed * 0.2) * reliability * 100);
}

export function isWeakNotion(score: number): boolean {
  return score < 60;
}
