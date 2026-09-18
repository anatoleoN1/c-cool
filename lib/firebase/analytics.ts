"use client";

import { getAnalytics, isSupported, logEvent, type Analytics } from "firebase/analytics";
import { getFirebaseClient } from "./client";

let analyticsPromise: Promise<Analytics | null> | null = null;

export function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (analyticsPromise) return analyticsPromise;

  analyticsPromise = isSupported()
    .then((supported) => {
      if (!supported) return null;
      const services = getFirebaseClient();
      return services ? getAnalytics(services.app) : null;
    })
    .catch(() => null);

  return analyticsPromise;
}

export async function trackEvent(
  name: string,
  parameters?: Record<string, string | number | boolean>,
): Promise<void> {
  const analytics = await getFirebaseAnalytics();
  if (!analytics) return;
  logEvent(analytics, name, parameters);
}
