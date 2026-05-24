"use client";

import Link from "next/link";
import { apiDelete, apiGet, apiPost } from "@/lib/api";
import { useEffect, useState } from "react";
import { useAdmin } from "../context";

type Table = {
  id: string;
  name: string;
  capacity: number;
  type: string;
  minSpendCents: number;
  active: boolean;
};

const TYPE_LABELS: Record<string, string> = {
  table: "Terrace",
  booth: "Booth",
  bar: "Bar",
  vip: "VIP",
};

const inputCls = "border border-[#1e2d40] bg-[#111d30] px-3 py-2 text-sm text-[#f0ece4] outline-none focus:border-[#d4a574] transition-colors placeholder:text-[#4a5872]";

export default function AdminTablesPage() {
  const { token } = useAdmin();
  const [rows, setRows] = useState<Table[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");

  useEffect(() => {
    if (token) load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function load() {
    try {
      const data = await apiGet<Table[]>(`/admin/tables`, { token: token! });
      setRows(data);
      setLoaded(true);
    } catch {
      setError("Failed to load tables");
    }
  }

  async function create() {
    if (!name.trim()) return;
    setError(null);
    try {
      await apiPost(`/admin/tables`, { name: name.trim(), capacity: 4, type: "table", minSpendCents: 0, active: true }, { token: token! });
      setName("");
      await load();
    } catch { setError("Failed to create table"); }
  }

  async function remove(id: string) {
    setError(null);
    try {
      await apiDelete(`/admin/tables/${id}`, { token: token! });
      await load();
    } catch { setError("Failed to delete table"); }
  }

  if (!token) {
    return (
      <div className="py-10 text-center">
        <p className="text-sm text-[#8b9bb4]">You need to <Link href="/admin" className="underline text-[#f0ece4]">sign in</Link> first.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <Link href="/admin" className="text-[11px] uppercase tracking-[0.16em] text-[#8b9bb4] hover:text-[#f0ece4] transition-colors">← Dashboard</Link>
          <h1 className="nt-display mt-2 text-3xl font-light italic text-[#f0ece4]">Tables</h1>
        </div>
        <button onClick={load} className="text-[11px] uppercase tracking-[0.16em] text-[#8b9bb4] hover:text-[#f0ece4] transition-colors">Refresh</button>
      </div>

      {error && <p className="mt-4 text-sm text-rose-400">{error}</p>}

      <div className="mt-8 flex gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Table name"
          onKeyDown={(e) => e.key === "Enter" && create()}
          className={`w-56 ${inputCls}`}
        />
        <button
          onClick={create}
          disabled={!name.trim()}
          className="border border-[#d4a574] px-5 py-2 text-[11px] uppercase tracking-[0.16em] text-[#d4a574] hover:bg-[#d4a574] hover:text-[#0a0e1a] transition-colors disabled:opacity-40"
        >
          Add table
        </button>
      </div>

      <div className="mt-6 border border-[#1e2d40]">
        {!loaded ? (
          <div className="px-5 py-10 text-center text-sm text-[#8b9bb4]">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-[#8b9bb4]">No tables yet</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#1e2d40] bg-[#111d30]">
              <tr>
                {["Name", "Type", "Capacity", "Min spend", ""].map((h) => (
                  <th key={h} className="px-5 py-3 text-[11px] uppercase tracking-[0.14em] font-medium text-[#8b9bb4]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2d40]">
              {rows.map((r) => (
                <tr key={r.id} className="bg-[#0d1526] hover:bg-[#111d30] transition-colors">
                  <td className="px-5 py-3.5 font-medium text-[#f0ece4]">{r.name}</td>
                  <td className="px-5 py-3.5 text-[#8b9bb4]">{TYPE_LABELS[r.type] ?? r.type}</td>
                  <td className="px-5 py-3.5 text-[#8b9bb4]">{r.capacity}</td>
                  <td className="px-5 py-3.5 text-[#8b9bb4]">${(r.minSpendCents / 100).toFixed(0)}</td>
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
}
