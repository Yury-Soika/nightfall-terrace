'use client';

import Link from 'next/link';
import { apiGet, apiPatch } from '@/lib/api';
import { useEffect, useState } from 'react';
import { useAdmin } from '../context';

type Booking = {
  id: string;
  bookingCode: string;
  status: string;
  guestName: string;
  guestEmail: string;
  partySize: number;
  table: { name: string };
  serviceDate?: string | null;
  slot: { date: string; startTime: string };
};

const STATUS_STYLES: Record<string, string> = {
  confirmed: 'bg-emerald-950/60 text-emerald-400 border-emerald-800',
  pending: 'bg-amber-950/60 text-amber-400 border-amber-800',
  completed: 'bg-[#192438] text-[#8b9bb4] border-[#243447]',
  cancelled: 'bg-rose-950/60 text-rose-400 border-rose-900',
};

function reservationDay(b: Booking): string {
  return b.serviceDate ?? b.slot.date;
}

function displayStatus(status: string, reservationDate: string) {
  if (status === 'confirmed' && reservationDate < localCalendarIso()) return 'completed';
  return status;
}

function localCalendarIso(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function BookingTable({ rows, onCancel, onConfirm, emptyText }: {
  rows: Booking[];
  onCancel: (id: string) => void;
  onConfirm: (id: string) => void;
  emptyText: string;
}) {
  if (rows.length === 0) {
    return <p className='py-8 text-center text-sm text-[#8b9bb4]'>{emptyText}</p>;
  }
  return (
    <table className='w-full text-left text-sm'>
      <thead className='border-b border-[#243447] bg-[#192438]'>
        <tr>
          {['Code', 'Date & time', 'Table', 'Guest', 'Guests', 'Status', ''].map((h) => (
            <th key={h} className='px-5 py-3 text-[11px] uppercase tracking-[0.14em] font-medium text-[#8b9bb4]'>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody className='divide-y divide-[#243447]'>
        {rows.map((b) => (
          <tr key={b.id} className='bg-[#141e2d] hover:bg-[#192438] transition-colors [&>td]:align-middle'>
            <td className='px-5 py-3.5 font-mono text-xs text-[#f0ece4]'>{b.bookingCode}</td>
            <td className='px-5 py-3.5 text-[#f0ece4]'>
              {reservationDay(b) === '1970-01-01' && !b.serviceDate ? (
                <span className='text-[#4a5872]'>Date not stored</span>
              ) : (
                new Date(reservationDay(b) + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              )}
              <span className='ml-1.5 text-[#8b9bb4]'>{b.slot.startTime}</span>
            </td>
            <td className='px-5 py-3.5 text-[#8b9bb4]'>{b.table.name}</td>
            <td className='px-5 py-3.5'>
              <p className='text-[#f0ece4]'>{b.guestName}</p>
              <p className='text-xs text-[#4a5872]'>{b.guestEmail}</p>
            </td>
            <td className='px-5 py-3.5 text-[#8b9bb4]'>{b.partySize}</td>
            <td className='px-5 py-3.5'>
              {(() => {
                const ds = displayStatus(b.status, reservationDay(b));
                return (
                  <span className={`inline-flex items-center border px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] ${STATUS_STYLES[ds] ?? STATUS_STYLES.completed}`}>
                    {ds}
                  </span>
                );
              })()}
            </td>
            <td className='w-[1%] whitespace-nowrap py-3.5 pl-3 pr-5 text-right align-middle'>
              <div className='inline-flex items-center justify-end gap-2'>
                {b.status === 'pending' && (
                  <button
                    type='button'
                    onClick={() => onConfirm(b.id)}
                    className='border border-emerald-800 bg-emerald-950/60 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-emerald-400 transition-colors hover:bg-emerald-900/60'
                  >
                    Confirm
                  </button>
                )}
                {(b.status === 'confirmed' || b.status === 'pending') && reservationDay(b) >= localCalendarIso() && (
                  <button
                    type='button'
                    onClick={() => onCancel(b.id)}
                    className='border border-rose-900 bg-rose-950/50 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-rose-400 transition-colors hover:bg-rose-900/50'
                  >
                    Cancel
                  </button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function AdminBookingsPage() {
  const { token } = useAdmin();
  const [rows, setRows] = useState<Booking[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const today = localCalendarIso();
  const todayRows = rows.filter((b) => reservationDay(b) === today && b.status !== 'cancelled');

  useEffect(() => {
    if (token) load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function load() {
    try {
      const data = await apiGet<Booking[]>(`/admin/bookings`, { token: token! });
      setRows(data);
      setLoaded(true);
    } catch {
      setError('Failed to load bookings');
    }
  }

  async function cancel(id: string) {
    setError(null);
    try {
      await apiPatch(`/admin/bookings/${id}/cancel`, {}, { token: token! });
      await load();
    } catch {
      setError('Failed to cancel booking');
    }
  }

  async function confirm(id: string) {
    setError(null);
    try {
      await apiPatch(`/admin/bookings/${id}/confirm`, {}, { token: token! });
      await load();
    } catch {
      setError('Failed to confirm booking');
    }
  }

  if (!token) {
    return (
      <div className='py-10 text-center'>
        <p className='text-sm text-[#8b9bb4]'>
          You need to <Link href='/admin' className='underline text-[#f0ece4]'>sign in</Link> first.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className='flex items-end justify-between gap-4'>
        <div>
          <Link href='/admin' className='text-[11px] uppercase tracking-[0.16em] text-[#8b9bb4] hover:text-[#f0ece4] transition-colors'>
            ← Dashboard
          </Link>
          <h1 className='nt-display mt-2 text-3xl font-light italic text-[#f0ece4]'>Bookings</h1>
        </div>
        <button onClick={load} className='text-[11px] uppercase tracking-[0.16em] text-[#8b9bb4] hover:text-[#f0ece4] transition-colors'>
          Refresh
        </button>
      </div>

      {error && <p className='mt-4 text-sm text-rose-400'>{error}</p>}

      {!loaded ? (
        <div className='mt-8 py-10 text-center text-sm text-[#8b9bb4]'>Loading…</div>
      ) : (
        <>
          <div className='mt-10'>
            <div className='flex items-center justify-between mb-3'>
              <h2 className='text-[11px] uppercase tracking-[0.2em] text-[#d4a574]'>
                Today —{' '}
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </h2>
              {todayRows.length > 0 && (
                <span className='text-[11px] text-[#8b9bb4]'>
                  {todayRows.length} reservation{todayRows.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            <div className='border border-[#243447]'>
              <BookingTable rows={todayRows} onCancel={cancel} onConfirm={confirm} emptyText='No reservations for today' />
            </div>
          </div>

          <div className='mt-10'>
            <div className='flex items-center justify-between mb-3'>
              <h2 className='text-[11px] uppercase tracking-[0.2em] text-[#8b9bb4]'>All reservations</h2>
              {rows.length > 0 && <span className='text-[11px] text-[#8b9bb4]'>{rows.length} total</span>}
            </div>

            {rows.length === 0 ? (
              <p className='py-8 text-center text-sm text-[#8b9bb4]'>No bookings yet</p>
            ) : (
              <div className='space-y-6'>
                {Object.entries(
                  rows.reduce<Record<string, Booking[]>>((acc, b) => {
                    const d = reservationDay(b);
                    (acc[d] ??= []).push(b);
                    return acc;
                  }, {}),
                )
                  .sort(([a], [b]) => b.localeCompare(a))
                  .map(([date, group]) => (
                    <div key={date}>
                      <p className='mb-2 text-[11px] uppercase tracking-[0.18em] text-[#4a5872]'>
                        {new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        <span className='ml-2 text-[#243447]'>·</span>
                        <span className='ml-2'>
                          {group.filter((b) => b.status !== 'cancelled').length}{' '}
                          {date < today ? 'completed' : 'confirmed'}
                        </span>
                      </p>
                      <div className='border border-[#243447]'>
                        <BookingTable rows={group} onCancel={cancel} onConfirm={confirm} emptyText='' />
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
