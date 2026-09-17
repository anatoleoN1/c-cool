export function normalizeContributionText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

export function tokenSimilarity(left: string, right: string): number {
  const a = new Set(normalizeContributionText(left).split(" ").filter(Boolean));
  const b = new Set(normalizeContributionText(right).split(" ").filter(Boolean));
  if (!a.size && !b.size) return 1;
  const intersection = [...a].filter((token) => b.has(token)).length;
  return intersection / new Set([...a, ...b]).size;
}
