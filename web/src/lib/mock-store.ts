// =============================================================================
// MOCK API STORE
// =============================================================================
// This file powers the mock backend used for portfolio/demo deployment.
// All data lives in memory and resets on every server restart — intentional,
// so the demo always starts clean and well-populated.
//
// HOW IT WORKS
// ------------
// The Next.js app serves its own API routes under /api/* (see src/app/api/).
// These routes mirror every NestJS endpoint and read/write from this store.
// No database, no separate process — just one Next.js server.
//
// TO SWITCH TO THE REAL NESTJS BACKEND
// -------------------------------------
// 1. Start the NestJS API:  npm run dev:api  (from the monorepo root)
// 2. In web/.env.local, change:
//       NEXT_PUBLIC_API_URL=/api          ← mock (current)
//    to:
//       NEXT_PUBLIC_API_URL=http://localhost:3001   ← real backend
// 3. The /api/* route handlers in src/app/api/ are ignored automatically
//    because all fetch calls now go to the NestJS server instead.
// 4. Set up your PostgreSQL database and run the NestJS seed to create
//    the admin user (see api/.env.example for required env vars).
//
// The frontend code (pages, components, BookingWidget, admin panel) does NOT
// need any changes — it only talks to NEXT_PUBLIC_API_URL.
// =============================================================================

export type TableType = "table" | "booth" | "bar" | "vip";
export type BookingStatus = "pending" | "confirmed" | "cancelled";

export type MockTable = {
  id: string;
  name: string;
  capacity: number;
  type: TableType;
  minSpendCents: number;
  active: boolean;
};

export type MockSlot = {
  id: string;
  startTime: string;
  endTime: string;
  active: boolean;
};

export type MockBooking = {
  id: string;
  bookingCode: string;
  tableId: string;
  slotId: string;
  serviceDate: string;
  guestName: string;
  guestEmail: string;
  partySize: number;
  status: BookingStatus;
  minSpendCents: number;
};

export type MockBlackout = {
  id: string;
  date: string;
  startTime: string | null;
  endTime: string | null;
  reason: string | null;
};

function daysFromNow(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function randomCode(): string {
  return "NF" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

const initialTables: MockTable[] = [
  { id: "t1", name: "Table 1", capacity: 4, type: "table", minSpendCents: 5000, active: true },
  { id: "t2", name: "Table 2", capacity: 4, type: "table", minSpendCents: 5000, active: true },
  { id: "t3", name: "Table 3", capacity: 2, type: "table", minSpendCents: 3000, active: true },
  { id: "b1", name: "Booth 1", capacity: 6, type: "booth", minSpendCents: 8000, active: true },
  { id: "b2", name: "Booth 2", capacity: 6, type: "booth", minSpendCents: 8000, active: true },
  { id: "bar1", name: "Bar 1", capacity: 2, type: "bar", minSpendCents: 2000, active: true },
  { id: "vip1", name: "VIP Suite", capacity: 10, type: "vip", minSpendCents: 20000, active: true },
];

const initialSlots: MockSlot[] = [
  { id: "s1", startTime: "18:00", endTime: "20:00", active: true },
  { id: "s2", startTime: "20:00", endTime: "22:00", active: true },
  { id: "s3", startTime: "22:00", endTime: "00:00", active: true },
];

const initialBookings: MockBooking[] = [
  {
    id: "bk1", bookingCode: "NF4A2B8C",
    tableId: "t1", slotId: "s1", serviceDate: daysFromNow(1),
    guestName: "Sophie Laurent", guestEmail: "sophie@example.com",
    partySize: 3, status: "confirmed", minSpendCents: 5000,
  },
  {
    id: "bk2", bookingCode: "NF7D3E9F",
    tableId: "b1", slotId: "s2", serviceDate: daysFromNow(1),
    guestName: "James Miller", guestEmail: "james@example.com",
    partySize: 5, status: "pending", minSpendCents: 8000,
  },
  {
    id: "bk3", bookingCode: "NF1G5H2J",
    tableId: "t2", slotId: "s2", serviceDate: daysFromNow(3),
    guestName: "Elena Vasquez", guestEmail: "elena@example.com",
    partySize: 2, status: "confirmed", minSpendCents: 5000,
  },
  {
    id: "bk4", bookingCode: "NF8K0L4M",
    tableId: "vip1", slotId: "s1", serviceDate: daysFromNow(5),
    guestName: "Marcus Chen", guestEmail: "marcus@example.com",
    partySize: 8, status: "pending", minSpendCents: 20000,
  },
  {
    id: "bk5", bookingCode: "NF2P6Q7R",
    tableId: "b2", slotId: "s3", serviceDate: daysFromNow(-2),
    guestName: "Anna Kowalski", guestEmail: "anna@example.com",
    partySize: 4, status: "confirmed", minSpendCents: 8000,
  },
];

export const store = {
  tables: [...initialTables],
  slots: [...initialSlots],
  bookings: [...initialBookings],
  blackouts: [] as MockBlackout[],
};

export const MOCK_ADMIN = {
  email: process.env.MOCK_ADMIN_EMAIL ?? "admin@nightfall.ee",
  password: process.env.MOCK_ADMIN_PASSWORD ?? "demo1234",
};

export const MOCK_TOKEN = "mock-nightfall-demo-token";
