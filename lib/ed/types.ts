/** Boundary for the future server-side École Directe connector. Never expose credentials to client code. */
export interface EcoleDirecteCredentials {
  username: string;
  password: string;
}

export interface EcoleDirecteSnapshot {
  fetchedAt: string;
  homework: unknown[];
  assessments: unknown[];
  schedule: unknown[];
}

export interface EcoleDirecteAdapter {
  authenticate(credentials: EcoleDirecteCredentials): Promise<void>;
  fetchSnapshot(): Promise<EcoleDirecteSnapshot>;
}
