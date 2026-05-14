"use client";

import { createContext, useContext, useEffect, useState } from "react";

type AdminCtx = {
  token: string | null;
  setToken: (t: string | null) => void;
};

const Ctx = createContext<AdminCtx>({ token: null, setToken: () => {} });

const STORAGE_KEY = "nightfall.adminToken";

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setToken(saved);
  }, []);

  useEffect(() => {
    if (token) localStorage.setItem(STORAGE_KEY, token);
    else localStorage.removeItem(STORAGE_KEY);
  }, [token]);

  return <Ctx.Provider value={{ token, setToken }}>{children}</Ctx.Provider>;
}

export function useAdmin() {
  return useContext(Ctx);
}
