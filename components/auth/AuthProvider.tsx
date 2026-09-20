"use client";

import { createContext, useContext, useMemo, useEffect, useState } from "react";
import { getIdTokenResult, type User as FirebaseUser } from "firebase/auth";
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
  role: User["role"];
  accessAllowed: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const isConfigured = isFirebaseConfigured();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [role, setRole] = useState<User["role"]>("student");
  const [accessAllowed, setAccessAllowed] = useState(false);
  const [loading, setLoading] = useState(isConfigured);

  useEffect(() => {
    if (!isConfigured) return;
    return observeAuth((nextUser) => {
      setUser(nextUser);
      if (!nextUser) {
        setProfile(null);
        setRole("student");
        setAccessAllowed(false);
        setLoading(false);
        return;
      }
      setLoading(true);
      void Promise.all([
        getCurrentProfile(nextUser.uid),
        getIdTokenResult(nextUser),
      ])
        .then(([nextProfile, tokenResult]) => {
          setProfile(nextProfile);
          const tokenRole = tokenResult.claims.role;
          setRole(
            tokenRole === "admin" || tokenRole === "moderator"
              ? tokenRole
              : "student",
          );
          setAccessAllowed(
            tokenResult.claims.accessGranted === true ||
              tokenResult.claims.role === "admin",
          );
        })
        .finally(() => setLoading(false));
    });
  }, [isConfigured]);

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      isConfigured,
      signIn,
      completeEcoleDirecteQcm,
      signOut,
      role,
      accessAllowed,
    }),
    [user, profile, loading, isConfigured, role, accessAllowed],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth doit être utilisé dans AuthProvider.");
  return context;
}
