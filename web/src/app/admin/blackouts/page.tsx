"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiDelete, apiGet, apiPost } from "@/lib/api";
import { useAdmin } from "../context";

type BlackoutRow = {
  id: string;
  date: string; // YYYY-MM-DD
  startTime?: string | null; // HH:MM (optional)
  endTime?: string | null; // HH:MM (optional)
  reason: string;
};

const inputCls =
  "border border-[#e2e0db] bg-white px-3 py-2 text-sm text-[#1a1a18] outline-none focus:border-[#1a1a18] transition-colors placeholder:text-[#b0aea9]";

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
    if (!token) return;
    if (!date.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await apiPost(
        "/admin/blackouts",
        {
          date: date.trim(),
          startTime: startTime.trim() ? startTime.trim() : null,
          endTime: endTime.trim() ? endTime.trim() : null,
          reason: reason.trim(),
        },
        { token },
      );
      setDate("");
      setStartTime("");
      setEndTime("");
      setReason("");
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
            Blackouts
          </h1>
          <p className="mt-1 text-sm text-[#6b6b68]">
            Blackouts mark dates as closed in the booking widget.
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

      <div className="mt-8 border border-[#e2e0db] bg-white p-6">
        <p className="text-[11px] uppercase tracking-[0.16em] text-[#6b6b68]">
          Create blackout
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1.5">
            <span className="text-[11px] uppercase tracking-[0.15em] text-[#6b6b68]">
              Date
            </span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="YYYY-MM-DD"
              className={inputCls}
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-[11px] uppercase tracking-[0.15em] text-[#6b6b68]">
              Start (optional)
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
              End (optional)
            </span>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              placeholder="HH:MM"
              className={inputCls}
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-[11px] uppercase tracking-[0.15em] text-[#6b6b68]">
              Reason (optional)
            </span>
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Private event"
              className={inputCls}
            />
          </label>
        </div>
        <button
          onClick={create}
          disabled={saving || !date.trim()}
          className="mt-5 border border-[#1a1a18] px-5 py-2 text-[11px] uppercase tracking-[0.16em] text-[#1a1a18] hover:bg-[#1a1a18] hover:text-white transition-colors disabled:opacity-40"
        >
          {saving ? "Saving…" : "Add blackout"}
        </button>
      </div>

      <div className="mt-8 border border-[#e2e0db]">
        {!loaded ? (
          <div className="px-5 py-10 text-center text-sm text-[#6b6b68]">
            Loading…
          </div>
        ) : rows.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-[#6b6b68]">
            No blackouts
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#e2e0db] bg-[#f0ece5]">
              <tr>
                {["Date", "Time", "Reason", ""].map((h) => (
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
                  <td className="px-5 py-3.5 font-medium text-[#1a1a18]">
                    {r.date}
                  </td>
                  <td className="px-5 py-3.5 text-[#6b6b68]">
                    {r.startTime && r.endTime ? `${r.startTime}–${r.endTime}` : "All day"}
                  </td>
                  <td className="px-5 py-3.5 text-[#6b6b68]">{r.reason}</td>
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

export default BlackoutsAdminPage;
