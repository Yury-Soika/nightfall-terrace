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

export default function AdminTablesPage() {
  const { token } = useAdmin();
  const [rows, setRows] = useState<Table[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");

  useEffect(() => {
    if (token) load();
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
        <p className="text-sm text-[#6b6b68]">You need to <Link href="/admin" className="underline text-[#1a1a18]">sign in</Link> first.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <Link href="/admin" className="text-[11px] uppercase tracking-[0.16em] text-[#6b6b68] hover:text-[#1a1a18] transition-colors">← Dashboard</Link>
          <h1 className="nt-display mt-2 text-3xl font-light italic text-[#1a1a18]">Tables</h1>
        </div>
        <button onClick={load} className="text-[11px] uppercase tracking-[0.16em] text-[#6b6b68] hover:text-[#1a1a18] transition-colors">Refresh</button>
      </div>

      {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}

      <div className="mt-8 flex gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Table name"
          onKeyDown={(e) => e.key === "Enter" && create()}
          className="w-56 border border-[#e2e0db] bg-white px-3 py-2 text-sm text-[#1a1a18] outline-none focus:border-[#1a1a18] transition-colors placeholder:text-[#b0aea9]"
        />
        <button
          onClick={create}
          disabled={!name.trim()}
          className="border border-[#1a1a18] px-5 py-2 text-[11px] uppercase tracking-[0.16em] text-[#1a1a18] hover:bg-[#1a1a18] hover:text-white transition-colors disabled:opacity-40"
        >
          Add table
        </button>
      </div>

      <div className="mt-6 border border-[#e2e0db]">
        {!loaded ? (
          <div className="px-5 py-10 text-center text-sm text-[#6b6b68]">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-[#6b6b68]">No tables yet</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#e2e0db] bg-[#f0ece5]">
              <tr>
                {["Name", "Type", "Capacity", "Min spend", ""].map((h) => (
                  <th key={h} className="px-5 py-3 text-[11px] uppercase tracking-[0.14em] font-medium text-[#6b6b68]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e0db]">
              {rows.map((r) => (
                <tr key={r.id} className="bg-white hover:bg-[#f7f5f2] transition-colors">
                  <td className="px-5 py-3.5 font-medium text-[#1a1a18]">{r.name}</td>
                  <td className="px-5 py-3.5 text-[#6b6b68]">{TYPE_LABELS[r.type] ?? r.type}</td>
                  <td className="px-5 py-3.5 text-[#6b6b68]">{r.capacity}</td>
                  <td className="px-5 py-3.5 text-[#6b6b68]">${(r.minSpendCents / 100).toFixed(0)}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button onClick={() => remove(r.id)} className="text-[11px] uppercase tracking-[0.14em] text-rose-500 hover:text-rose-700 transition-colors">Delete</button>
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
