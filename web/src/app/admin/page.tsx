"use client";

import Link from "next/link";
import { useState } from "react";
import { apiPost } from "@/lib/api";
import { useAdmin } from "./context";

const inputCls = "w-full border border-[#e2e0db] bg-white px-3 py-2.5 text-sm text-[#1a1a18] outline-none focus:border-[#1a1a18] transition-colors placeholder:text-[#b0aea9]";

const defaultAdminEmail =
  typeof process.env.NEXT_PUBLIC_ADMIN_EMAIL === "string"
    ? process.env.NEXT_PUBLIC_ADMIN_EMAIL.trim()
    : "";

export default function AdminPage() {
  const { token, setToken } = useAdmin();
  const [email, setEmail] = useState(defaultAdminEmail);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await apiPost<{ accessToken: string }>("/auth/login", { email, password });
      setToken(res.accessToken);
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="w-full max-w-sm">
          <h1 className="nt-display text-3xl font-light italic text-[#1a1a18]">Sign in</h1>
          <p className="mt-1 text-sm text-[#6b6b68]">Admin access only</p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <label className="block">
              <span className="text-[11px] uppercase tracking-[0.15em] text-[#6b6b68]">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="admin@your-venue.com"
                className={`mt-1.5 ${inputCls}`}
              />
            </label>
            <label className="block">
              <span className="text-[11px] uppercase tracking-[0.15em] text-[#6b6b68]">Password</span>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" className={`mt-1.5 ${inputCls}`} />
            </label>

            {error && <p className="text-sm text-rose-600">{error}</p>}

            <button
              disabled={loading}
              className="w-full border border-[#1a1a18] py-2.5 text-[11px] uppercase tracking-[0.2em] text-[#1a1a18] hover:bg-[#1a1a18] hover:text-white transition-colors disabled:opacity-50"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#c8a96e]">Dashboard</p>
          <h1 className="nt-display mt-2 text-3xl font-light italic text-[#1a1a18]">Nightfall Terrace</h1>
        </div>
        <button onClick={() => setToken(null)} className="text-[11px] uppercase tracking-[0.16em] text-[#6b6b68] hover:text-[#1a1a18] transition-colors">
          Sign out
        </button>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Link href="/admin/tables" className="group border border-[#e2e0db] bg-white p-7 hover:border-[#1a1a18] transition-colors">
          <p className="text-base font-medium text-[#1a1a18]">Tables</p>
          <p className="mt-1 text-sm text-[#6b6b68]">Manage tables and seating areas</p>
          <p className="mt-4 text-[11px] uppercase tracking-[0.16em] text-[#c8a96e] group-hover:tracking-[0.22em] transition-all">Manage →</p>
        </Link>
        <Link href="/admin/time-slots" className="group border border-[#e2e0db] bg-white p-7 hover:border-[#1a1a18] transition-colors">
          <p className="text-base font-medium text-[#1a1a18]">Time slots</p>
          <p className="mt-1 text-sm text-[#6b6b68]">Create available times for each date</p>
          <p className="mt-4 text-[11px] uppercase tracking-[0.16em] text-[#c8a96e] group-hover:tracking-[0.22em] transition-all">Manage →</p>
        </Link>
        <Link href="/admin/bookings" className="group border border-[#e2e0db] bg-white p-7 hover:border-[#1a1a18] transition-colors">
          <p className="text-base font-medium text-[#1a1a18]">Bookings</p>
          <p className="mt-1 text-sm text-[#6b6b68]">Confirm, view, or cancel reservations</p>
          <p className="mt-4 text-[11px] uppercase tracking-[0.16em] text-[#c8a96e] group-hover:tracking-[0.22em] transition-all">Manage →</p>
        </Link>
        <Link href="/admin/blackouts" className="group border border-[#e2e0db] bg-white p-7 hover:border-[#1a1a18] transition-colors">
          <p className="text-base font-medium text-[#1a1a18]">Blackouts</p>
          <p className="mt-1 text-sm text-[#6b6b68]">Mark dates as closed</p>
          <p className="mt-4 text-[11px] uppercase tracking-[0.16em] text-[#c8a96e] group-hover:tracking-[0.22em] transition-all">Manage →</p>
        </Link>
      </div>
    </div>
  );
}
