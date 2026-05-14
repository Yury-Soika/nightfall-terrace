"use client";

import { useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import { apiGet, apiPost } from "@/lib/api"; // apiPost still used for /bookings
import "react-day-picker/dist/style.css";

// ─── Types ────────────────────────────────────────────────────────────────────

type Slot = { id: string; startTime: string; endTime: string };

type Table = {
  id: string;
  name: string;
  capacity: number;
  type: string;
  minSpendCents: number;
  availability: { slotId: string; soldOut: boolean }[];
};

type Availability = {
  date: string;
  blackout: boolean;
  reason?: string;
  slots: Slot[];
  tables: Table[];
};

type Booking = {
  id: string;
  bookingCode: string;
  table: { name: string };
  slot: { startTime: string; endTime: string };
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const toIso = (d: Date): string => {
  // DayPicker gives a local Date (midnight local). Using toISOString() converts to UTC
  // and can shift the calendar day (off-by-one) depending on timezone.
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const STEPS = ["Date", "Time", "Table", "Details"] as const;
type Step = 0 | 1 | 2 | 3;

// ─── Step indicator ───────────────────────────────────────────────────────────

const StepBar = ({ step }: { step: Step }) => {
  return (
    <div className="flex items-center gap-0 mb-10">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={[
                "flex h-7 w-7 items-center justify-center text-[11px] font-medium transition-colors",
                i < step
                  ? "bg-[#1a1a18] text-white"
                  : i === step
                    ? "border border-[#1a1a18] text-[#1a1a18]"
                    : "border border-[#e2e0db] text-[#b0aea9]",
              ].join(" ")}
            >
              {i < step ? (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path
                    d="M1.5 5L4 7.5L8.5 2.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            <span
              className={[
                "text-[10px] uppercase tracking-[0.15em]",
                i === step ? "text-[#1a1a18]" : "text-[#b0aea9]",
              ].join(" ")}
            >
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={[
                "mx-3 mb-5 h-px w-10 sm:w-16 transition-colors",
                i < step ? "bg-[#1a1a18]" : "bg-[#e2e0db]",
              ].join(" ")}
            />
          )}
        </div>
      ))}
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────

const BookingWidget = () => {
  const [step, setStep] = useState<Step>(0);

  // Step 0
  const [selectedDay, setSelectedDay] = useState<Date | undefined>();
  const [partySize, setPartySize] = useState(2);

  // Step 1 — loaded after date chosen
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  // Step 2
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);

  // Step 3
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState<Booking | null>(null);

  const [error, setError] = useState<string | null>(null);

  const chosenSlot = useMemo(
    () => availability?.slots.find((s) => s.id === selectedSlotId) ?? null,
    [availability, selectedSlotId],
  );
  const chosenTable = useMemo(
    () => availability?.tables.find((t) => t.id === selectedTableId) ?? null,
    [availability, selectedTableId],
  );

  // ── Actions ────────────────────────────────────────────────────────────────

  const errMessage = (e: unknown, fallback: string): string => {
    if (
      e &&
      typeof e === "object" &&
      "message" in e &&
      typeof (e as { message?: unknown }).message === "string"
    ) {
      return (e as { message: string }).message;
    }
    return fallback;
  };

  const goToSlots = async (): Promise<void> => {
    if (!selectedDay) {
      setError("Pick a date");
      return;
    }
    setError(null);
    setLoadingSlots(true);
    try {
      const data = await apiGet<Availability>(
        `/availability?venue=nightfall-terrace&date=${toIso(selectedDay)}&partySize=${partySize}`,
      );
      setAvailability(data);
      setSelectedSlotId(null);
      setSelectedTableId(null);
      setStep(1);
    } catch (e: unknown) {
      setError(errMessage(e, "Could not load availability"));
    } finally {
      setLoadingSlots(false);
    }
  };

  const createBooking = async (): Promise<void> => {
    if (!chosenSlot || !chosenTable || !guestName.trim() || !guestEmail.trim()) {
      setError("Please fill in all fields");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const booking = await apiPost<Booking>("/bookings", {
        venue: "nightfall-terrace",
        date: toIso(selectedDay!),
        startTime: chosenSlot.startTime,
        tableId: chosenTable.id,
        partySize,
        guestName,
        guestEmail,
      });
      setCreated(booking);
    } catch (e: unknown) {
      setError(errMessage(e, "Failed to create booking"));
    } finally {
      setSubmitting(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <section id="reservation" className="bg-[#f0ece5]">
      <div className="nt-container py-20 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#c8a96e]">
            Reservations
          </p>
          <h2 className="nt-display mt-3 text-4xl font-light italic text-[#1a1a18] sm:text-5xl">
            Book a table
          </h2>
          <p className="mt-4 mb-10 text-sm leading-relaxed text-[#6b6b68]">
            Choose your evening and we&apos;ll take care of the rest.
          </p>

          <StepBar step={step} />

          {error && <p className="mb-6 text-sm text-rose-600">{error}</p>}

          {/* ── Step 0: Date + party size ── */}
          {step === 0 && (
            <div className="space-y-8">
              <div>
                <p className="mb-4 text-[11px] uppercase tracking-[0.18em] text-[#6b6b68]">
                  Select a date
                </p>
                <div className="inline-block border border-[#e2e0db] bg-white p-4">
                  <DayPicker
                    mode="single"
                    selected={selectedDay}
                    onSelect={setSelectedDay}
                    disabled={{ before: new Date() }}
                    classNames={{
                      root: "rdp-custom",
                      month_caption:
                        "nt-display text-base font-light text-[#1a1a18] mb-3 px-1",
                      weekday:
                        "text-[10px] uppercase tracking-[0.12em] text-[#b0aea9] w-9 text-center pb-2",
                      day: "w-9 h-9 text-sm text-[#1a1a18] hover:bg-[#f0ece5] transition-colors rounded-none",
                      day_button:
                        "w-full h-full flex items-center justify-center",
                      selected: "!bg-[#1a1a18] !text-white",
                      today: "font-semibold text-[#c8a96e]",
                      disabled: "text-[#d0cec9] cursor-not-allowed",
                      nav: "flex items-center justify-between mb-2",
                      button_previous:
                        "p-1 text-[#6b6b68] hover:text-[#1a1a18] transition-colors",
                      button_next:
                        "p-1 text-[#6b6b68] hover:text-[#1a1a18] transition-colors",
                      weeks: "border-t border-[#f0ece5] pt-2",
                    }}
                  />
                </div>
              </div>

              <div>
                <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-[#6b6b68]">
                  Party size
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setPartySize((n) => Math.max(1, n - 1))}
                    className="flex h-10 w-10 items-center justify-center border border-[#e2e0db] text-[#1a1a18] hover:border-[#1a1a18] transition-colors text-lg"
                  >
                    −
                  </button>
                  <span className="nt-display w-10 text-center text-2xl font-light text-[#1a1a18]">
                    {partySize}
                  </span>
                  <button
                    onClick={() => setPartySize((n) => n + 1)}
                    className="flex h-10 w-10 items-center justify-center border border-[#e2e0db] text-[#1a1a18] hover:border-[#1a1a18] transition-colors text-lg"
                  >
                    +
                  </button>
                  <span className="ml-1 text-sm text-[#6b6b68]">
                    {partySize === 1 ? "guest" : "guests"}
                  </span>
                </div>
              </div>

              <button
                disabled={!selectedDay || loadingSlots}
                onClick={goToSlots}
                className="border border-[#1a1a18] px-8 py-3 text-[11px] uppercase tracking-[0.2em] text-[#1a1a18] hover:bg-[#1a1a18] hover:text-white transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loadingSlots ? "Checking…" : "Continue"}
              </button>
            </div>
          )}

          {/* ── Step 1: Time slot ── */}
          {step === 1 && availability && (
            <div className="space-y-8">
              {availability.blackout ? (
                <div className="border border-[#e2e0db] bg-white p-6">
                  <p className="text-sm text-[#6b6b68]">
                    We&apos;re closed on this date
                    {availability.reason ? ` — ${availability.reason}` : ""}.
                  </p>
                  <button
                    onClick={() => setStep(0)}
                    className="mt-4 text-[11px] uppercase tracking-[0.18em] text-[#1a1a18] underline underline-offset-2"
                  >
                    Pick another date
                  </button>
                </div>
              ) : (
                <>
                  <div>
                    <p className="mb-1 text-[11px] uppercase tracking-[0.18em] text-[#6b6b68]">
                      {selectedDay?.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="mb-6 text-[11px] uppercase tracking-[0.18em] text-[#b0aea9]">
                      {partySize} {partySize === 1 ? "guest" : "guests"}
                    </p>
                    <p className="mb-4 text-[11px] uppercase tracking-[0.18em] text-[#6b6b68]">
                      Choose a time
                    </p>

                    {availability.slots.length === 0 ? (
                      <div className="border border-[#e2e0db] bg-white p-6">
                        <p className="text-sm text-[#6b6b68]">
                          No time slots are available for this date.
                        </p>
                        <button
                          onClick={() => setStep(0)}
                          className="mt-4 text-[11px] uppercase tracking-[0.18em] text-[#1a1a18] underline underline-offset-2"
                        >
                          Pick another date
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-3">
                        {availability.slots.map((s) => (
                          <button
                            key={s.id}
                            onClick={() => setSelectedSlotId(s.id)}
                            className={[
                              "px-5 py-3 text-sm border transition-colors duration-150",
                              selectedSlotId === s.id
                                ? "bg-[#1a1a18] border-[#1a1a18] text-white"
                                : "border-[#e2e0db] text-[#1a1a18] hover:border-[#1a1a18]",
                            ].join(" ")}
                          >
                            {s.startTime}
                            <span
                              className={`ml-1 text-xs ${selectedSlotId === s.id ? "text-white/60" : "text-[#b0aea9]"}`}
                            >
                              – {s.endTime}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep(0)}
                      className="text-[11px] uppercase tracking-[0.18em] text-[#6b6b68] hover:text-[#1a1a18] transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      disabled={!selectedSlotId}
                      onClick={() => {
                        setError(null);
                        setStep(2);
                      }}
                      className="border border-[#1a1a18] px-8 py-3 text-[11px] uppercase tracking-[0.2em] text-[#1a1a18] hover:bg-[#1a1a18] hover:text-white transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Continue
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── Step 2: Table ── */}
          {step === 2 && availability && (
            <div className="space-y-8">
              <div>
                <p className="mb-1 text-[11px] uppercase tracking-[0.18em] text-[#6b6b68]">
                  {selectedDay?.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                  {" · "}
                  {chosenSlot?.startTime} – {chosenSlot?.endTime}
                </p>
                <p className="mb-6 text-[11px] uppercase tracking-[0.18em] text-[#b0aea9]">
                  {partySize} {partySize === 1 ? "guest" : "guests"}
                </p>
                <p className="mb-4 text-[11px] uppercase tracking-[0.18em] text-[#6b6b68]">
                  Choose a table
                </p>
                {(["table", "booth", "bar", "vip"] as const).map((type) => {
                  const group = availability.tables
                    .filter((t) => t.type === type)
                    .sort((a, b) =>
                      a.name.localeCompare(b.name, undefined, { numeric: true }),
                    );
                  if (!group.length) return null;
                  const labels: Record<string, string> = {
                    table: "Terrace tables",
                    booth: "Booths",
                    bar: "Bar seats",
                    vip: "VIP",
                  };
                  return (
                    <div key={type} className="mb-6">
                      <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-[#b0aea9]">
                        {labels[type]}
                      </p>
                      <div className="divide-y divide-[#e2e0db] border border-[#e2e0db]">
                        {group.map((t) => {
                          const soldOut =
                            t.availability.find((a) => a.slotId === selectedSlotId!)
                              ?.soldOut ?? false;
                          return (
                            <button
                              key={t.id}
                              disabled={soldOut}
                              onClick={() => setSelectedTableId(t.id)}
                              className={[
                                "w-full text-left px-5 py-4 transition-colors duration-150",
                                selectedTableId === t.id
                                  ? "bg-[#1a1a18]"
                                  : soldOut
                                    ? "bg-white opacity-40 cursor-not-allowed"
                                    : "bg-white hover:bg-[#f7f5f2]",
                              ].join(" ")}
                            >
                              <div className="flex items-center justify-between gap-4">
                                <div>
                                  <p
                                    className={`text-sm font-medium ${selectedTableId === t.id ? "text-white" : "text-[#1a1a18]"}`}
                                  >
                                    {t.name}
                                  </p>
                                  <p
                                    className={`mt-0.5 text-xs ${selectedTableId === t.id ? "text-white/55" : "text-[#6b6b68]"}`}
                                  >
                                    Up to {t.capacity}{" "}
                                    {t.capacity === 1 ? "guest" : "guests"} · min
                                    spend ${(t.minSpendCents / 100).toFixed(0)}
                                  </p>
                                </div>
                                <span
                                  className={`shrink-0 text-[10px] uppercase tracking-[0.14em] ${selectedTableId === t.id ? "text-white/60" : soldOut ? "text-[#b0aea9]" : "text-[#c8a96e]"}`}
                                >
                                  {soldOut
                                    ? "Unavailable"
                                    : selectedTableId === t.id
                                      ? "Selected"
                                      : "Available"}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="text-[11px] uppercase tracking-[0.18em] text-[#6b6b68] hover:text-[#1a1a18] transition-colors"
                >
                  ← Back
                </button>
                <button
                  disabled={!selectedTableId}
                  onClick={() => {
                    setError(null);
                    setStep(3);
                  }}
                  className="border border-[#1a1a18] px-8 py-3 text-[11px] uppercase tracking-[0.2em] text-[#1a1a18] hover:bg-[#1a1a18] hover:text-white transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* ── Step 3: Guest details + confirm ── */}
          {step === 3 && (
            <div className="space-y-8">
              {/* Summary */}
              <div className="border border-[#e2e0db] bg-white divide-y divide-[#e2e0db]">
                <div className="flex justify-between px-5 py-4 text-sm">
                  <span className="text-[#6b6b68]">Date</span>
                  <span className="text-[#1a1a18]">
                    {selectedDay?.toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between px-5 py-4 text-sm">
                  <span className="text-[#6b6b68]">Time</span>
                  <span className="text-[#1a1a18]">
                    {chosenSlot?.startTime} – {chosenSlot?.endTime}
                  </span>
                </div>
                <div className="flex justify-between px-5 py-4 text-sm">
                  <span className="text-[#6b6b68]">Table</span>
                  <span className="text-[#1a1a18]">
                    {chosenTable?.name} · {chosenTable?.type}
                  </span>
                </div>
                <div className="flex justify-between px-5 py-4 text-sm">
                  <span className="text-[#6b6b68]">Guests</span>
                  <span className="text-[#1a1a18]">{partySize}</span>
                </div>
              </div>

              {!created ? (
                <>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="grid gap-2">
                      <span className="text-[11px] uppercase tracking-[0.15em] text-[#6b6b68]">
                        Full name
                      </span>
                      <input
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="Your name"
                        className="border border-[#e2e0db] bg-white px-4 py-3 text-sm text-[#1a1a18] outline-none focus:border-[#1a1a18] transition-colors placeholder:text-[#b0aea9]"
                      />
                    </label>
                    <label className="grid gap-2">
                      <span className="text-[11px] uppercase tracking-[0.15em] text-[#6b6b68]">
                        Email
                      </span>
                      <input
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="border border-[#e2e0db] bg-white px-4 py-3 text-sm text-[#1a1a18] outline-none focus:border-[#1a1a18] transition-colors placeholder:text-[#b0aea9]"
                      />
                    </label>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep(2)}
                      className="text-[11px] uppercase tracking-[0.18em] text-[#6b6b68] hover:text-[#1a1a18] transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      disabled={submitting}
                      onClick={createBooking}
                      className="border border-[#1a1a18] px-8 py-3 text-[11px] uppercase tracking-[0.2em] text-[#1a1a18] hover:bg-[#1a1a18] hover:text-white transition-colors duration-200 disabled:opacity-40"
                    >
                      {submitting ? "Confirming…" : "Confirm reservation"}
                    </button>
                  </div>
                </>
              ) : (
                <div className="border border-[#c8a96e]/40 bg-[#c8a96e]/5 px-6 py-6 space-y-3">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[#c8a96e]">
                    You&apos;re all set
                  </p>
                  <p className="nt-display text-2xl font-light italic text-[#1a1a18]">
                    Request received
                  </p>
                  <p className="text-sm text-[#6b6b68]">
                    We&apos;ll confirm shortly. Your reference code is{" "}
                    <span className="font-medium text-[#1a1a18]">
                      {created!.bookingCode}
                    </span>
                    .
                  </p>
                  <p className="text-xs text-[#b0aea9]">
                    A confirmation will be sent to {guestEmail}.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BookingWidget;