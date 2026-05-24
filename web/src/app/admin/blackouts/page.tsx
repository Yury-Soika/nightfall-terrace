"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiDelete, apiGet, apiPost } from "@/lib/api";
import { useAdmin } from "../context";

type BlackoutRow = {
  id: string;
  date: string;
  startTime?: string | null;
  endTime?: string | null;
  reason: string;
};

const inputCls = "border border-[#243447] bg-[#192438] px-3 py-2 text-sm text-[#f0ece4] outline-none focus:border-[#d4a574] transition-colors placeholder:text-[#4a5872]";

const BlackoutsAdminPage = () => {
  const { token } = useAdmin();
  const [rows, setRows] = useState<BlackoutRow[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    if (!token) return;
    setError(null);
    try {
      const data = await apiGet<BlackoutRow[]>("/admin/blackouts", { token });
      setRows(data);
      setLoaded(true);
    } catch {
      setError("Failed to load blackouts");
    }
  };

  useEffect(() => {
    if (token) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const create = async () => {
    if (!token || !date.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await apiPost(
        "/admin/blackouts",
        {
          date: date.trim(),
          startTime: startTime.trim() || null,
          endTime: endTime.trim() || null,
          reason: reason.trim(),
        },
        { token },
      );
      setDate(""); setStartTime(""); setEndTime(""); setReason("");
      await load();
    } catch {
      setError("Failed to create blackout (maybe duplicate date?)");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!token) return;
    setError(null);
    try {
      await apiDelete(`/admin/blackouts/${id}`, { token });
      await load();
    } catch {
      setError("Failed to delete blackout");
    }
  };

  if (!token) {
    return (
      <div className="py-10 text-center">
        <p className="text-sm text-[#8b9bb4]">
          You need to <Link href="/admin" className="underline text-[#f0ece4]">sign in</Link> first.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <Link href="/admin" className="text-[11px] uppercase tracking-[0.16em] text-[#8b9bb4] hover:text-[#f0ece4] transition-colors">
            ← Dashboard
          </Link>
          <h1 className="nt-display mt-2 text-3xl font-light italic text-[#f0ece4]">Blackouts</h1>
          <p className="mt-1 text-sm text-[#8b9bb4]">Blackouts mark dates as closed in the booking widget.</p>
        </div>
        <button onClick={load} className="text-[11px] uppercase tracking-[0.16em] text-[#8b9bb4] hover:text-[#f0ece4] transition-colors">
          Refresh
        </button>
      </div>

      {error && <p className="mt-4 text-sm text-rose-400">{error}</p>}

      <div className="mt-8 border border-[#243447] bg-[#141e2d] p-6">
        <p className="text-[11px] uppercase tracking-[0.16em] text-[#8b9bb4]">Create blackout</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1.5">
            <span className="text-[11px] uppercase tracking-[0.15em] text-[#8b9bb4]">Date</span>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} />
          </label>
          <label className="grid gap-1.5">
            <span className="text-[11px] uppercase tracking-[0.15em] text-[#8b9bb4]">Start (optional)</span>
            <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className={inputCls} />
          </label>
          <label className="grid gap-1.5">
            <span className="text-[11px] uppercase tracking-[0.15em] text-[#8b9bb4]">End (optional)</span>
            <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className={inputCls} />
          </label>
          <label className="grid gap-1.5">
            <span className="text-[11px] uppercase tracking-[0.15em] text-[#8b9bb4]">Reason (optional)</span>
            <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Private event" className={inputCls} />
          </label>
        </div>
        <button
          onClick={create}
          disabled={saving || !date.trim()}
          className="mt-5 border border-[#d4a574] px-5 py-2 text-[11px] uppercase tracking-[0.16em] text-[#d4a574] hover:bg-[#d4a574] hover:text-[#0f1621] transition-colors disabled:opacity-40"
        >
          {saving ? "Saving…" : "Add blackout"}
        </button>
      </div>

      <div className="mt-8 overflow-x-auto border border-[#243447]">
        {!loaded ? (
          <div className="px-5 py-10 text-center text-sm text-[#8b9bb4]">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-[#8b9bb4]">No blackouts</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#243447] bg-[#192438]">
              <tr>
                {["Date", "Time", "Reason", ""].map((h) => (
                  <th key={h} className="px-5 py-3 text-[11px] uppercase tracking-[0.14em] font-medium text-[#8b9bb4]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#243447]">
              {rows.map((r) => (
                <tr key={r.id} className="bg-[#141e2d] hover:bg-[#192438] transition-colors">
                  <td className="px-5 py-3.5 font-medium text-[#f0ece4]">{r.date}</td>
                  <td className="px-5 py-3.5 text-[#8b9bb4]">
                    {r.startTime && r.endTime ? `${r.startTime}–${r.endTime}` : "All day"}
                  </td>
                  <td className="px-5 py-3.5 text-[#8b9bb4]">{r.reason}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button onClick={() => remove(r.id)} className="text-[11px] uppercase tracking-[0.14em] text-rose-400 hover:text-rose-300 transition-colors">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default BlackoutsAdminPage;
