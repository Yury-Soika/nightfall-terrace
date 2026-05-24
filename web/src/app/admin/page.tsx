"use client";

import Link from "next/link";
import { useState } from "react";
import { apiPost } from "@/lib/api";
import { useAdmin } from "./context";

const inputCls = "w-full border border-[#1e2d40] bg-[#111d30] px-3 py-2.5 text-sm text-[#f0ece4] outline-none focus:border-[#d4a574] transition-colors placeholder:text-[#4a5872]";

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
          <h1 className="nt-display text-3xl font-light italic text-[#f0ece4]">Sign in</h1>
          <p className="mt-1 text-sm text-[#8b9bb4]">Admin access only</p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <label className="block">
              <span className="text-[11px] uppercase tracking-[0.15em] text-[#8b9bb4]">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="admin@nightfall-terrace.com"
                className={`mt-1.5 ${inputCls}`}
              />
            </label>
            <label className="block">
              <span className="text-[11px] uppercase tracking-[0.15em] text-[#8b9bb4]">Password</span>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" className={`mt-1.5 ${inputCls}`} />
            </label>

            {error && <p className="text-sm text-rose-400">{error}</p>}

            <button
              disabled={loading}
              className="w-full border border-[#d4a574] py-2.5 text-[11px] uppercase tracking-[0.2em] text-[#d4a574] hover:bg-[#d4a574] hover:text-[#0a0e1a] transition-colors disabled:opacity-50"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const cards = [
    { href: "/admin/bookings", title: "Bookings", desc: "Confirm, view, or cancel reservations" },
    { href: "/admin/tables", title: "Tables", desc: "Manage tables and seating areas" },
    { href: "/admin/time-slots", title: "Time slots", desc: "Create available times for each date" },
    { href: "/admin/blackouts", title: "Blackouts", desc: "Mark dates as closed" },
  ];

  return (
    <div>
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#d4a574]">Dashboard</p>
          <h1 className="nt-display mt-2 text-3xl font-light italic text-[#f0ece4]">Nightfall Terrace</h1>
        </div>
        <button onClick={() => setToken(null)} className="text-[11px] uppercase tracking-[0.16em] text-[#8b9bb4] hover:text-[#f0ece4] transition-colors">
          Sign out
        </button>
      </div>

      <div className="mt-10 grid gap-3 sm:grid-cols-2">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group border border-[#1e2d40] bg-[#0d1526] p-7 hover:border-[#d4a574]/40 hover:bg-[#111d30] transition-colors"
          >
            <p className="text-base font-medium text-[#f0ece4]">{c.title}</p>
            <p className="mt-1 text-sm text-[#8b9bb4]">{c.desc}</p>
            <p className="mt-4 text-[11px] uppercase tracking-[0.16em] text-[#d4a574] group-hover:tracking-[0.22em] transition-all">
              Manage →
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
