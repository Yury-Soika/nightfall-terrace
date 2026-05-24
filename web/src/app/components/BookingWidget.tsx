"use client";

import { useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import { apiGet, apiPost } from "@/lib/api";
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
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const STEPS = ["Date", "Time", "Table", "Details"] as const;
type Step = 0 | 1 | 2 | 3;

// ─── Step indicator ───────────────────────────────────────────────────────────

const StepBar = ({ step }: { step: Step }) => (
  <div className="flex items-center gap-0 mb-10">
    {STEPS.map((label, i) => (
      <div key={label} className="flex items-center">
        <div className="flex flex-col items-center gap-1.5">
          <div
            className={[
              "flex h-7 w-7 items-center justify-center text-[11px] font-medium transition-colors",
              i < step
                ? "bg-[#d4a574] text-[#0f1621]"
                : i === step
                  ? "border border-[#d4a574] text-[#d4a574]"
                  : "border border-[#243447] text-[#4a5872]",
            ].join(" ")}
          >
            {i < step ? (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              i + 1
            )}
          </div>
          <span
            className={[
              "text-[10px] uppercase tracking-[0.15em]",
              i === step ? "text-[#d4a574]" : "text-[#4a5872]",
            ].join(" ")}
          >
            {label}
          </span>
        </div>
        {i < STEPS.length - 1 && (
          <div
            className={[
              "mx-3 mb-5 h-px w-10 sm:w-16 transition-colors",
              i < step ? "bg-[#d4a574]" : "bg-[#243447]",
            ].join(" ")}
          />
        )}
      </div>
    ))}
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────

const BookingWidget = () => {
  const [step, setStep] = useState<Step>(0);

  const [selectedDay, setSelectedDay] = useState<Date | undefined>();
  const [partySize, setPartySize] = useState(2);

  const [availability, setAvailability] = useState<Availability | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);

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

  const errMessage = (e: unknown, fallback: string): string => {
    if (e && typeof e === "object" && "message" in e && typeof (e as { message?: unknown }).message === "string") {
      return (e as { message: string }).message;
    }
    return fallback;
  };

  const goToSlots = async (): Promise<void> => {
    if (!selectedDay) { setError("Pick a date"); return; }
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

  const inputCls = "border border-[#243447] bg-[#192438] px-4 py-3 text-sm text-[#f0ece4] outline-none focus:border-[#d4a574] transition-colors placeholder:text-[#4a5872]";
  const btnPrimary = "border border-[#d4a574] px-8 py-3 text-[11px] uppercase tracking-[0.2em] text-[#d4a574] hover:bg-[#d4a574] hover:text-[#0f1621] transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed";
  const btnBack = "text-[11px] uppercase tracking-[0.18em] text-[#4a5872] hover:text-[#f0ece4] transition-colors";

  return (
    <section id="reservation" className="bg-[#0f1621] border-t border-[#243447]">
      <div className="nt-container py-20 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#d4a574]">
            Reservations
          </p>
          <h2 className="nt-display mt-3 text-4xl font-light italic text-[#f0ece4] sm:text-5xl">
            Book a table
          </h2>
          <p className="mt-4 mb-10 text-sm leading-relaxed text-[#8b9bb4]">
            Choose your evening and we&apos;ll take care of the rest.
          </p>

          <StepBar step={step} />

          {error && <p className="mb-6 text-sm text-rose-400">{error}</p>}

          {/* ── Step 0: Date + party size ── */}
          {step === 0 && (
            <div className="space-y-8">
              <div>
                <p className="mb-4 text-[11px] uppercase tracking-[0.18em] text-[#8b9bb4]">Select a date</p>
                <div className="inline-block border border-[#243447] bg-[#141e2d] p-4">
                  <DayPicker
                    mode="single"
                    selected={selectedDay}
                    onSelect={setSelectedDay}
                    disabled={{ before: new Date() }}
                    classNames={{
                      root: "rdp-custom",
                      month_caption: "nt-display text-base font-light text-[#f0ece4] mb-3 px-1",
                      weekday: "text-[10px] uppercase tracking-[0.12em] text-[#4a5872] w-9 text-center pb-2",
                      day: "w-9 h-9 text-sm text-[#f0ece4] hover:bg-[#192438] transition-colors rounded-none",
                      day_button: "w-full h-full flex items-center justify-center",
                      selected: "!bg-[#d4a574] !text-[#0f1621]",
                      today: "font-semibold text-[#d4a574]",
                      disabled: "text-[#4a5872] cursor-not-allowed",
                      nav: "flex items-center justify-between mb-2",
                      button_previous: "p-1 text-[#8b9bb4] hover:text-[#f0ece4] transition-colors",
                      button_next: "p-1 text-[#8b9bb4] hover:text-[#f0ece4] transition-colors",
                      weeks: "border-t border-[#243447] pt-2",
                    }}
                  />
                </div>
              </div>

              <div>
                <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-[#8b9bb4]">Party size</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setPartySize((n) => Math.max(1, n - 1))}
                    className="flex h-10 w-10 items-center justify-center border border-[#243447] text-[#f0ece4] hover:border-[#d4a574] hover:text-[#d4a574] transition-colors text-lg"
                  >
                    −
                  </button>
                  <span className="nt-display w-10 text-center text-2xl font-light text-[#f0ece4]">
                    {partySize}
                  </span>
                  <button
                    onClick={() => setPartySize((n) => n + 1)}
                    className="flex h-10 w-10 items-center justify-center border border-[#243447] text-[#f0ece4] hover:border-[#d4a574] hover:text-[#d4a574] transition-colors text-lg"
                  >
                    +
                  </button>
                  <span className="ml-1 text-sm text-[#8b9bb4]">
                    {partySize === 1 ? "guest" : "guests"}
                  </span>
                </div>
              </div>

              <button disabled={!selectedDay || loadingSlots} onClick={goToSlots} className={btnPrimary}>
                {loadingSlots ? "Checking…" : "Continue"}
              </button>
            </div>
          )}

          {/* ── Step 1: Time slot ── */}
          {step === 1 && availability && (
            <div className="space-y-8">
              {availability.blackout ? (
                <div className="border border-[#243447] bg-[#141e2d] p-6">
                  <p className="text-sm text-[#8b9bb4]">
                    We&apos;re closed on this date{availability.reason ? ` — ${availability.reason}` : ""}.
                  </p>
                  <button onClick={() => setStep(0)} className="mt-4 text-[11px] uppercase tracking-[0.18em] text-[#d4a574] underline underline-offset-2">
                    Pick another date
                  </button>
                </div>
              ) : (
                <>
                  <div>
                    <p className="mb-1 text-[11px] uppercase tracking-[0.18em] text-[#8b9bb4]">
                      {selectedDay?.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                    </p>
                    <p className="mb-6 text-[11px] uppercase tracking-[0.18em] text-[#4a5872]">
                      {partySize} {partySize === 1 ? "guest" : "guests"}
                    </p>
                    <p className="mb-4 text-[11px] uppercase tracking-[0.18em] text-[#8b9bb4]">Choose a time</p>

                    {availability.slots.length === 0 ? (
                      <div className="border border-[#243447] bg-[#141e2d] p-6">
                        <p className="text-sm text-[#8b9bb4]">No time slots are available for this date.</p>
                        <button onClick={() => setStep(0)} className="mt-4 text-[11px] uppercase tracking-[0.18em] text-[#d4a574] underline underline-offset-2">
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
                                ? "bg-[#d4a574] border-[#d4a574] text-[#0f1621]"
                                : "border-[#243447] text-[#f0ece4] hover:border-[#d4a574]",
                            ].join(" ")}
                          >
                            {s.startTime}
                            <span className={`ml-1 text-xs ${selectedSlotId === s.id ? "text-[#0f1621]/60" : "text-[#4a5872]"}`}>
                              – {s.endTime}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <button onClick={() => setStep(0)} className={btnBack}>← Back</button>
                    <button disabled={!selectedSlotId} onClick={() => { setError(null); setStep(2); }} className={btnPrimary}>
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
                <p className="mb-1 text-[11px] uppercase tracking-[0.18em] text-[#8b9bb4]">
                  {selectedDay?.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                  {" · "}{chosenSlot?.startTime} – {chosenSlot?.endTime}
                </p>
                <p className="mb-6 text-[11px] uppercase tracking-[0.18em] text-[#4a5872]">
                  {partySize} {partySize === 1 ? "guest" : "guests"}
                </p>
                <p className="mb-4 text-[11px] uppercase tracking-[0.18em] text-[#8b9bb4]">Choose a table</p>

                {(["table", "booth", "bar", "vip"] as const).map((type) => {
                  const group = availability.tables
                    .filter((t) => t.type === type)
                    .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
                  if (!group.length) return null;
                  const labels: Record<string, string> = { table: "Terrace tables", booth: "Booths", bar: "Bar seats", vip: "VIP" };
                  return (
                    <div key={type} className="mb-6">
                      <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-[#4a5872]">{labels[type]}</p>
                      <div className="divide-y divide-[#243447] border border-[#243447]">
                        {group.map((t) => {
                          const soldOut = t.availability.find((a) => a.slotId === selectedSlotId!)?.soldOut ?? false;
                          return (
                            <button
                              key={t.id}
                              disabled={soldOut}
                              onClick={() => setSelectedTableId(t.id)}
                              className={[
                                "w-full text-left px-5 py-4 transition-colors duration-150",
                                selectedTableId === t.id
                                  ? "bg-[#d4a574]"
                                  : soldOut
                                    ? "bg-[#141e2d] opacity-40 cursor-not-allowed"
                                    : "bg-[#141e2d] hover:bg-[#192438]",
                              ].join(" ")}
                            >
                              <div className="flex items-center justify-between gap-4">
                                <div>
                                  <p className={`text-sm font-medium ${selectedTableId === t.id ? "text-[#0f1621]" : "text-[#f0ece4]"}`}>
                                    {t.name}
                                  </p>
                                  <p className={`mt-0.5 text-xs ${selectedTableId === t.id ? "text-[#0f1621]/60" : "text-[#8b9bb4]"}`}>
                                    Up to {t.capacity} {t.capacity === 1 ? "guest" : "guests"} · min spend ${(t.minSpendCents / 100).toFixed(0)}
                                  </p>
                                </div>
                                <span className={`shrink-0 text-[10px] uppercase tracking-[0.14em] ${selectedTableId === t.id ? "text-[#0f1621]/60" : soldOut ? "text-[#4a5872]" : "text-[#d4a574]"}`}>
                                  {soldOut ? "Unavailable" : selectedTableId === t.id ? "Selected" : "Available"}
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
                <button onClick={() => setStep(1)} className={btnBack}>← Back</button>
                <button disabled={!selectedTableId} onClick={() => { setError(null); setStep(3); }} className={btnPrimary}>
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* ── Step 3: Guest details + confirm ── */}
          {step === 3 && (
            <div className="space-y-8">
              <div className="border border-[#243447] divide-y divide-[#243447]">
                {[
                  { label: "Date", value: selectedDay?.toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric" }) },
                  { label: "Time", value: `${chosenSlot?.startTime} – ${chosenSlot?.endTime}` },
                  { label: "Table", value: `${chosenTable?.name} · ${chosenTable?.type}` },
                  { label: "Guests", value: String(partySize) },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between px-5 py-4 text-sm">
                    <span className="text-[#8b9bb4]">{label}</span>
                    <span className="text-[#f0ece4]">{value}</span>
                  </div>
                ))}
              </div>

              {!created ? (
                <>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="grid gap-2">
                      <span className="text-[11px] uppercase tracking-[0.15em] text-[#8b9bb4]">Full name</span>
                      <input value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="Your name" className={inputCls} />
                    </label>
                    <label className="grid gap-2">
                      <span className="text-[11px] uppercase tracking-[0.15em] text-[#8b9bb4]">Email</span>
                      <input value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} placeholder="you@example.com" className={inputCls} />
                    </label>
                  </div>

                  <div className="flex gap-4">
                    <button onClick={() => setStep(2)} className={btnBack}>← Back</button>
                    <button disabled={submitting} onClick={createBooking} className={btnPrimary}>
                      {submitting ? "Confirming…" : "Confirm reservation"}
                    </button>
                  </div>
                </>
              ) : (
                <div className="border border-[#d4a574]/30 bg-[#d4a574]/5 px-6 py-6 space-y-3">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[#d4a574]">You&apos;re all set</p>
                  <p className="nt-display text-2xl font-light italic text-[#f0ece4]">Request received</p>
                  <p className="text-sm text-[#8b9bb4]">
                    We&apos;ll confirm shortly. Your reference code is{" "}
                    <span className="font-medium text-[#f0ece4]">{created!.bookingCode}</span>.
                  </p>
                  <p className="text-xs text-[#4a5872]">A confirmation will be sent to {guestEmail}.</p>
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
