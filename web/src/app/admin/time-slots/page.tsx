"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { apiDelete, apiGet, apiPost } from "@/lib/api";
import { useAdmin } from "../context";

type TimeSlotRow = {
  id: string;
  startTime: string;
  endTime: string;
  active: boolean;
};

const inputCls = "border border-[#243447] bg-[#192438] px-3 py-2 text-sm text-[#f0ece4] outline-none focus:border-[#d4a574] transition-colors placeholder:text-[#4a5872]";

const TimeSlotsAdminPage = () => {
  const { token } = useAdmin();
  const [rows, setRows] = useState<TimeSlotRow[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [startTime, setStartTime] = useState("19:00");
  const [endTime, setEndTime] = useState("21:00");
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const listPath = useMemo(() => `/admin/time-slots`, []);

  const load = async () => {
    if (!token) return;
    setError(null);
    try {
      const data = await apiGet<TimeSlotRow[]>(listPath, { token });
      setRows(data);
      setLoaded(true);
    } catch {
      setError("Failed to load time slots");
    }
  };

  useEffect(() => {
    if (token) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, listPath]);

  const create = async () => {
    if (!token || !startTime.trim() || !endTime.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await apiPost("/admin/time-slots", { startTime: startTime.trim(), endTime: endTime.trim(), active }, { token });
      await load();
    } catch {
      setError("Failed to create time slot (maybe duplicate?)");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!token) return;
    setError(null);
    try {
      await apiDelete(`/admin/time-slots/${id}`, { token });
      await load();
    } catch {
      setError("Failed to delete time slot");
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
          <h1 className="nt-display mt-2 text-3xl font-light italic text-[#f0ece4]">Time slots</h1>
          <p className="mt-1 text-sm text-[#8b9bb4]">These slots are available every day (unless blocked by blackouts).</p>
        </div>
        <button onClick={load} className="text-[11px] uppercase tracking-[0.16em] text-[#8b9bb4] hover:text-[#f0ece4] transition-colors">
          Refresh
        </button>
      </div>

      {error && <p className="mt-4 text-sm text-rose-400">{error}</p>}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="border border-[#243447] bg-[#141e2d] p-6">
          <p className="text-[11px] uppercase tracking-[0.16em] text-[#8b9bb4]">Create time slot</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1.5">
              <span className="text-[11px] uppercase tracking-[0.15em] text-[#8b9bb4]">Active</span>
              <select value={active ? "yes" : "no"} onChange={(e) => setActive(e.target.value === "yes")} className={inputCls}>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </label>
            <label className="grid gap-1.5">
              <span className="text-[11px] uppercase tracking-[0.15em] text-[#8b9bb4]">Start</span>
              <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className={inputCls} />
            </label>
            <label className="grid gap-1.5">
              <span className="text-[11px] uppercase tracking-[0.15em] text-[#8b9bb4]">End</span>
              <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className={inputCls} />
            </label>
          </div>
          <button
            onClick={create}
            disabled={saving || !startTime.trim() || !endTime.trim()}
            className="mt-5 border border-[#d4a574] px-5 py-2 text-[11px] uppercase tracking-[0.16em] text-[#d4a574] hover:bg-[#d4a574] hover:text-[#0f1621] transition-colors disabled:opacity-40"
          >
            {saving ? "Saving…" : "Add time slot"}
          </button>
        </div>

        <div className="border border-[#243447] bg-[#141e2d] p-6">
          <p className="text-xs text-[#4a5872]">
            Tip: to block a specific date/time, add a blackout entry for that date.
          </p>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto border border-[#243447]">
        {!loaded ? (
          <div className="px-5 py-10 text-center text-sm text-[#8b9bb4]">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-[#8b9bb4]">No time slots found</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#243447] bg-[#192438]">
              <tr>
                {["Start", "End", "Active", ""].map((h) => (
                  <th key={h} className="px-5 py-3 text-[11px] uppercase tracking-[0.14em] font-medium text-[#8b9bb4]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#243447]">
              {rows.map((r) => (
                <tr key={r.id} className="bg-[#141e2d] hover:bg-[#192438] transition-colors">
                  <td className="px-5 py-3.5 text-[#f0ece4]">{r.startTime}</td>
                  <td className="px-5 py-3.5 text-[#f0ece4]">{r.endTime}</td>
                  <td className="px-5 py-3.5">
                    <span className={r.active ? "text-emerald-400" : "text-[#4a5872]"}>{r.active ? "Yes" : "No"}</span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button onClick={() => remove(r.id)} className="text-[11px] uppercase tracking-[0.14em] text-rose-400 hover:text-rose-300 transition-colors">Delete</button>
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

export default TimeSlotsAdminPage;
