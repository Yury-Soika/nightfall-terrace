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
  /** Calendar day of the visit; slot.date is the template row (often 1970-01-01). */
  serviceDate?: string | null;
  slot: { date: string; startTime: string };
};

const STATUS_STYLES: Record<string, string> = {
  confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  pending: 'bg-amber-50 text-amber-800 border-amber-200',
  completed: 'bg-[#f0ece5] text-[#6b6b68] border-[#e2e0db]',
  cancelled: 'bg-rose-50 text-rose-600 border-rose-200',
};

/** Calendar day for the reservation (persisted on the booking). */
function reservationDay(b: Booking): string {
  return b.serviceDate ?? b.slot.date;
}

function displayStatus(status: string, reservationDate: string) {
  if (status === 'confirmed' && reservationDate < localCalendarIso())
    return 'completed';
  return status;
}

/** YYYY-MM-DD in the browser's local timezone — matches BookingWidget and stored slot dates. */
function localCalendarIso(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function BookingTable({
  rows,
  onCancel,
  onConfirm,
  emptyText,
}: {
  rows: Booking[];
  onCancel: (id: string) => void;
  onConfirm: (id: string) => void;
  emptyText: string;
}) {
  if (rows.length === 0) {
    return (
      <p className='py-8 text-center text-sm text-[#6b6b68]'>{emptyText}</p>
    );
  }
  return (
    <table className='w-full text-left text-sm'>
      <thead className='border-b border-[#e2e0db] bg-[#f0ece5]'>
        <tr>
          {[
            'Code',
            'Date & time',
            'Table',
            'Guest',
            'Guests',
            'Status',
            '',
          ].map((h) => (
            <th
              key={h}
              className='px-5 py-3 text-[11px] uppercase tracking-[0.14em] font-medium text-[#6b6b68]'
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className='divide-y divide-[#e2e0db]'>
        {rows.map((b) => (
          <tr
            key={b.id}
            className='bg-white hover:bg-[#f7f5f2] transition-colors [&>td]:align-middle'
          >
            <td className='px-5 py-3.5 font-mono text-xs text-[#1a1a18]'>
              {b.bookingCode}
            </td>
            <td className='px-5 py-3.5 text-[#1a1a18]'>
              {reservationDay(b) === '1970-01-01' && !b.serviceDate ? (
                <span className='text-[#b0aea9]'>Date not stored</span>
              ) : (
                new Date(reservationDay(b) + 'T00:00:00').toLocaleDateString(
                  'en-US',
                  {
                    month: 'short',
                    day: 'numeric',
                  },
                )
              )}
              <span className='ml-1.5 text-[#6b6b68]'>{b.slot.startTime}</span>
            </td>
            <td className='px-5 py-3.5 text-[#6b6b68]'>{b.table.name}</td>
            <td className='px-5 py-3.5'>
              <p className='text-[#1a1a18]'>{b.guestName}</p>
              <p className='text-xs text-[#b0aea9]'>{b.guestEmail}</p>
            </td>
            <td className='px-5 py-3.5 text-[#6b6b68]'>{b.partySize}</td>
            <td className='px-5 py-3.5'>
              {(() => {
                const ds = displayStatus(b.status, reservationDay(b));
                return (
                  <span
                    className={`inline-flex items-center border px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] ${STATUS_STYLES[ds] ?? 'bg-[#f0ece5] text-[#6b6b68] border-[#e2e0db]'}`}
                  >
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
                    className='rounded-md border border-emerald-200/80 bg-emerald-50/60 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-emerald-900 transition-colors hover:border-emerald-300 hover:bg-emerald-100/90 active:scale-[0.98]'
                  >
                    Confirm
                  </button>
                )}
                {(b.status === 'confirmed' || b.status === 'pending') &&
                  reservationDay(b) >= localCalendarIso() && (
                    <button
                      type='button'
                      onClick={() => onCancel(b.id)}
                      className='rounded-md border border-rose-200/80 bg-rose-50/50 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-rose-700 transition-colors hover:border-rose-300 hover:bg-rose-100/80 active:scale-[0.98]'
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
  const todayRows = rows.filter(
    (b) => reservationDay(b) === today && b.status !== 'cancelled',
  );

  useEffect(() => {
    if (token) load();
  }, [token]);

  async function load() {
    try {
      const data = await apiGet<Booking[]>(`/admin/bookings`, {
        token: token!,
      });
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
        <p className='text-sm text-[#6b6b68]'>
          You need to{' '}
          <Link href='/admin' className='underline text-[#1a1a18]'>
            sign in
          </Link>{' '}
          first.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className='flex items-end justify-between gap-4'>
        <div>
          <Link
            href='/admin'
            className='text-[11px] uppercase tracking-[0.16em] text-[#6b6b68] hover:text-[#1a1a18] transition-colors'
          >
            ← Dashboard
          </Link>
          <h1 className='nt-display mt-2 text-3xl font-light italic text-[#1a1a18]'>
            Bookings
          </h1>
        </div>
        <button
          onClick={load}
          className='text-[11px] uppercase tracking-[0.16em] text-[#6b6b68] hover:text-[#1a1a18] transition-colors'
        >
          Refresh
        </button>
      </div>

      {error && <p className='mt-4 text-sm text-rose-600'>{error}</p>}

      {!loaded ? (
        <div className='mt-8 py-10 text-center text-sm text-[#6b6b68]'>
          Loading…
        </div>
      ) : (
        <>
          {/* Today */}
          <div className='mt-10'>
            <div className='flex items-center justify-between mb-3'>
              <h2 className='text-[11px] uppercase tracking-[0.2em] text-[#c8a96e]'>
                Today —{' '}
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </h2>
              {todayRows.length > 0 && (
                <span className='text-[11px] text-[#6b6b68]'>
                  {todayRows.length} reservation
                  {todayRows.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            <div className='border border-[#e2e0db]'>
              <BookingTable
                rows={todayRows}
                onCancel={cancel}
                onConfirm={confirm}
                emptyText='No reservations for today'
              />
            </div>
          </div>

          {/* All reservations grouped by date */}
          <div className='mt-10'>
            <div className='flex items-center justify-between mb-3'>
              <h2 className='text-[11px] uppercase tracking-[0.2em] text-[#6b6b68]'>
                All reservations
              </h2>
              {rows.length > 0 && (
                <span className='text-[11px] text-[#6b6b68]'>
                  {rows.length} total
                </span>
              )}
            </div>

            {rows.length === 0 ? (
              <p className='py-8 text-center text-sm text-[#6b6b68]'>
                No bookings yet
              </p>
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
                      <p className='mb-2 text-[11px] uppercase tracking-[0.18em] text-[#b0aea9]'>
                        {new Date(date + 'T00:00:00').toLocaleDateString(
                          'en-US',
                          { weekday: 'long', month: 'long', day: 'numeric' },
                        )}
                        <span className='ml-2 text-[#e2e0db]'>·</span>
                        <span className='ml-2'>
                          {group.filter((b) => b.status !== 'cancelled').length}{' '}
                          {date < today ? 'completed' : 'confirmed'}
                        </span>
                      </p>
                      <div className='border border-[#e2e0db]'>
                        <BookingTable
                          rows={group}
                          onCancel={cancel}
                          onConfirm={confirm}
                          emptyText=''
                        />
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
