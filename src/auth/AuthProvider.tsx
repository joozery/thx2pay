"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore, type ReactNode } from "react";

export type User = { name: string; email: string };
type AuthValue = { user: User | null; ready: boolean; login: (email: string) => void; logout: () => void };

const storageKey = "thx2pay-user";
const authEvent = "thx2pay-auth-change";
const AuthContext = createContext<AuthValue>({ user: null, ready: false, login: () => {}, logout: () => {} });

function subscribe(onChange: () => void) {
  window.addEventListener(authEvent, onChange);
  window.addEventListener("storage", onChange);
  return () => { window.removeEventListener(authEvent, onChange); window.removeEventListener("storage", onChange); };
}
function readStored() {
  try { return localStorage.getItem(storageKey); } catch { return null; }
}
const noopSubscribe = () => () => {};

// Front-end only sign-in: there is no member backend yet, so this just remembers the email in this browser.
export default function AuthProvider({ children }: { children: ReactNode }) {
  const raw = useSyncExternalStore(subscribe, readStored, () => null);
  const ready = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const user = useMemo<User | null>(() => { try { return raw ? JSON.parse(raw) as User : null; } catch { return null; } }, [raw]);

  useEffect(() => {
    document.documentElement.dataset.auth = user ? "in" : "out";
  }, [user]);

  const login = useCallback((email: string) => {
    try { localStorage.setItem(storageKey, JSON.stringify({ email, name: email.split("@")[0] || "member" })); } catch { /* Sign-in needs storage in this prototype. */ }
    window.dispatchEvent(new Event(authEvent));
  }, []);

  const logout = useCallback(() => {
    try { localStorage.removeItem(storageKey); } catch { /* Nothing to clear. */ }
    window.dispatchEvent(new Event(authEvent));
  }, []);

  const value = useMemo(() => ({ user, ready, login, logout }), [user, ready, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
