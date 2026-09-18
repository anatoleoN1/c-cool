"use client";

import { createContext, useContext, useMemo, useEffect, useState } from "react";
import type { User as FirebaseUser } from "firebase/auth";
import type { User } from "@/types";
import { completeEcoleDirecteQcm, getCurrentProfile, observeAuth, signIn, signOut } from "@/lib/firebase/auth";
import { isFirebaseConfigured } from "@/lib/firebase/client";

type AuthContextValue = {
  user: FirebaseUser | null;
  profile: User | null;
  loading: boolean;
  isConfigured: boolean;
  signIn: typeof signIn;
  completeEcoleDirecteQcm: typeof completeEcoleDirecteQcm;
  signOut: typeof signOut;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const isConfigured = isFirebaseConfigured();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(isConfigured);

  useEffect(() => {
    if (!isConfigured) return;
    return observeAuth((nextUser) => {
      setUser(nextUser);
      if (!nextUser) {
        setProfile(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      void getCurrentProfile(nextUser.uid)
        .then(setProfile)
        .finally(() => setLoading(false));
    });
  }, [isConfigured]);

  const value = useMemo(
    () => ({ user, profile, loading, isConfigured, signIn, completeEcoleDirecteQcm, signOut }),
    [user, profile, loading, isConfigured],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth doit être utilisé dans AuthProvider.");
  return context;
}
