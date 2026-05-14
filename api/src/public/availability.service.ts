import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TableEntity } from '../entities/table.entity';
import { TimeSlot } from '../entities/time-slot.entity';
import { Booking, BookingStatus } from '../entities/booking.entity';
import { BlackoutDate } from '../entities/blackout-date.entity';

function toDow(date: string) {
  const d = new Date(date + 'T00:00:00');
  if (Number.isNaN(d.getTime())) throw new BadRequestException('Invalid date');
  return d.getDay(); // 0..6
}

const TEMPLATE_DATE = '1970-01-01';

function isFullDayBlackout(b: BlackoutDate) {
  return !b.startTime && !b.endTime;
}

function isTimeBlocked(params: { startTime: string }, b: BlackoutDate) {
  if (!b.startTime || !b.endTime) return false;
  // HH:MM strings compare lexicographically correctly.
  return params.startTime >= b.startTime && params.startTime < b.endTime;
}

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectRepository(TableEntity)
    private readonly tables: Repository<TableEntity>,
    @InjectRepository(TimeSlot) private readonly slots: Repository<TimeSlot>,
    @InjectRepository(Booking) private readonly bookings: Repository<Booking>,
    @InjectRepository(BlackoutDate)
    private readonly blackouts: Repository<BlackoutDate>,
  ) {}

  async getAvailability(params: { date: string; partySize: number }) {
    const date = params.date;
    toDow(date);

    const blackouts = await this.blackouts.find({
      where: { date },
      order: { startTime: 'ASC' as any },
    });
    const fullDay = blackouts.find(isFullDayBlackout);
    if (fullDay) {
      return {
        venue: { slug: 'nightfall-terrace', name: 'Nightfall Terrace' },
        date,
        blackout: true,
        reason: fullDay.reason,
        slots: [],
        tables: [],
      };
    }

    const slots = await this.slots.find({
      where: { date: TEMPLATE_DATE, active: true },
      order: { startTime: 'ASC' },
    });
    const allowedSlots = slots.filter(
      (s) => !blackouts.some((b) => isTimeBlocked({ startTime: s.startTime }, b)),
    );

    const tables = await this.tables.find({
      where: { active: true },
      order: { name: 'ASC' },
    });

    // Sold out if an active booking exists for that table+slot (pending/confirmed)
    const activeBookings = await this.bookings.find({
      where: {
        status: BookingStatus.pending,
      },
      relations: { table: true, slot: true },
    });
    const confirmedBookings = await this.bookings.find({
      where: { status: BookingStatus.confirmed },
      relations: { table: true, slot: true },
    });

    const taken = new Set<string>();
    for (const b of [...activeBookings, ...confirmedBookings]) {
      const day = b.serviceDate ?? b.slot?.date;
      // Template slots use 1970-01-01; ignore legacy rows without a real service day.
      if (!day || day === TEMPLATE_DATE) continue;
      taken.add(`${b.table.id}:${b.slot.id}:${day}`);
    }

    const partySize = params.partySize;
    const tableDtos = tables
      .filter((t) => t.capacity >= partySize)
      .map((t) => ({
        id: t.id,
        name: t.name,
        capacity: t.capacity,
        type: t.type,
        minSpendCents: t.minSpendCents,
        availability: allowedSlots.map((s) => ({
          slotId: s.id,
          startTime: s.startTime,
          endTime: s.endTime,
          soldOut: taken.has(`${t.id}:${s.id}:${date}`),
        })),
      }));

    return {
      venue: { slug: 'nightfall-terrace', name: 'Nightfall Terrace' },
      date,
      blackout: false,
      slots: allowedSlots.map((s) => ({
        id: s.id,
        startTime: s.startTime,
        endTime: s.endTime,
      })),
      tables: tableDtos,
    };
  }
}
