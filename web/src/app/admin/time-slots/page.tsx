"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { apiDelete, apiGet, apiPost } from "@/lib/api";
import { useAdmin } from "../context";

type TimeSlotRow = {
  id: string;
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  active: boolean;
};

const inputCls =
  "border border-[#e2e0db] bg-white px-3 py-2 text-sm text-[#1a1a18] outline-none focus:border-[#1a1a18] transition-colors placeholder:text-[#b0aea9]";

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
    if (!token) return;
    if (!startTime.trim() || !endTime.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await apiPost(
        "/admin/time-slots",
        { startTime: startTime.trim(), endTime: endTime.trim(), active },
        { token },
      );
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
        <p className="text-sm text-[#6b6b68]">
          You need to{" "}
          <Link href="/admin" className="underline text-[#1a1a18]">
            sign in
          </Link>{" "}
          first.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <Link
            href="/admin"
            className="text-[11px] uppercase tracking-[0.16em] text-[#6b6b68] hover:text-[#1a1a18] transition-colors"
          >
            ← Dashboard
          </Link>
          <h1 className="nt-display mt-2 text-3xl font-light italic text-[#1a1a18]">
            Time slots
          </h1>
          <p className="mt-1 text-sm text-[#6b6b68]">
            These slots are available every day (unless blocked by blackouts).
          </p>
        </div>
        <button
          onClick={load}
          className="text-[11px] uppercase tracking-[0.16em] text-[#6b6b68] hover:text-[#1a1a18] transition-colors"
        >
          Refresh
        </button>
      </div>

      {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="border border-[#e2e0db] bg-white p-6">
          <p className="text-[11px] uppercase tracking-[0.16em] text-[#6b6b68]">
            Create time slot
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1.5">
              <span className="text-[11px] uppercase tracking-[0.15em] text-[#6b6b68]">
                Active
              </span>
              <select
                value={active ? "yes" : "no"}
                onChange={(e) => setActive(e.target.value === "yes")}
                className={inputCls}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </label>
            <label className="grid gap-1.5">
              <span className="text-[11px] uppercase tracking-[0.15em] text-[#6b6b68]">
                Start
              </span>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="HH:MM"
                className={inputCls}
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-[11px] uppercase tracking-[0.15em] text-[#6b6b68]">
                End
              </span>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="HH:MM"
                className={inputCls}
              />
            </label>
          </div>
          <button
            onClick={create}
            disabled={saving || !startTime.trim() || !endTime.trim()}
            className="mt-5 border border-[#1a1a18] px-5 py-2 text-[11px] uppercase tracking-[0.16em] text-[#1a1a18] hover:bg-[#1a1a18] hover:text-white transition-colors disabled:opacity-40"
          >
            {saving ? "Saving…" : "Add time slot"}
          </button>
        </div>

        <div className="border border-[#e2e0db] bg-white p-6">
          <p className="mt-3 text-xs text-[#b0aea9]">
            Tip: to block a specific date/time, add a blackout entry for that date.
          </p>
        </div>
      </div>

      <div className="mt-8 border border-[#e2e0db]">
        {!loaded ? (
          <div className="px-5 py-10 text-center text-sm text-[#6b6b68]">
            Loading…
          </div>
        ) : rows.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-[#6b6b68]">
            No time slots found
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#e2e0db] bg-[#f0ece5]">
              <tr>
                {["Start", "End", "Active", ""].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-[11px] uppercase tracking-[0.14em] font-medium text-[#6b6b68]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e0db]">
              {rows.map((r) => (
                <tr
                  key={r.id}
                  className="bg-white hover:bg-[#f7f5f2] transition-colors"
                >
                  <td className="px-5 py-3.5 text-[#6b6b68]">{r.startTime}</td>
                  <td className="px-5 py-3.5 text-[#6b6b68]">{r.endTime}</td>
                  <td className="px-5 py-3.5 text-[#6b6b68]">
                    {r.active ? "Yes" : "No"}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => remove(r.id)}
                      className="text-[11px] uppercase tracking-[0.14em] text-rose-500 hover:text-rose-700 transition-colors"
                    >
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

export default TimeSlotsAdminPage;
