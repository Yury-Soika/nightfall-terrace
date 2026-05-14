import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { TableEntity } from '../entities/table.entity';
import { TimeSlot } from '../entities/time-slot.entity';
import { Booking, BookingStatus } from '../entities/booking.entity';
import { BlackoutDate } from '../entities/blackout-date.entity';

function randomCode(len = 8) {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < len; i++)
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return out;
}

function dayOfWeek(date: string) {
  const d = new Date(date + 'T00:00:00');
  if (Number.isNaN(d.getTime())) throw new BadRequestException('Invalid date');
  return d.getDay();
}

const TEMPLATE_DATE = '1970-01-01';

function isFullDayBlackout(b: BlackoutDate) {
  return !b.startTime && !b.endTime;
}

function isTimeBlocked(startTime: string, b: BlackoutDate) {
  if (!b.startTime || !b.endTime) return false;
  return startTime >= b.startTime && startTime < b.endTime;
}

export type CreateBookingDto = {
  date: string;
  startTime: string;
  tableId: string;
  partySize: number;
  guestName: string;
  guestEmail: string;
};

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(TableEntity)
    private readonly tables: Repository<TableEntity>,
    @InjectRepository(TimeSlot) private readonly slots: Repository<TimeSlot>,
    @InjectRepository(Booking) private readonly bookings: Repository<Booking>,
    @InjectRepository(BlackoutDate)
    private readonly blackouts: Repository<BlackoutDate>,
  ) {}

  private async getSlot(date: string, startTime: string) {
    const slot = await this.slots.findOne({
      where: { date: TEMPLATE_DATE, startTime, active: true },
    });
    if (!slot) throw new BadRequestException('Invalid slot');
    return slot;
  }

  async create(dto: CreateBookingDto) {
    const blackouts = await this.blackouts.find({
      where: { date: dto.date },
    });
    const fullDay = blackouts.find(isFullDayBlackout);
    if (fullDay) throw new BadRequestException('Venue is closed on this date');
    if (blackouts.some((b) => isTimeBlocked(dto.startTime, b)))
      throw new BadRequestException('This time is not available');

    const table = await this.tables.findOne({
      where: { id: dto.tableId, active: true },
    });
    if (!table) throw new BadRequestException('Invalid table');
    if (table.capacity < dto.partySize)
      throw new BadRequestException('Party size exceeds capacity');

    const slot = await this.getSlot(dto.date, dto.startTime);

    const existing = await this.bookings.findOne({
      where: {
        table: { id: table.id },
        slot: { id: slot.id },
        serviceDate: dto.date,
        status: In([BookingStatus.confirmed, BookingStatus.pending]),
      },
    });
    if (existing)
      throw new BadRequestException('Table is sold out for this slot');

    dayOfWeek(dto.date);

    const booking = this.bookings.create({
      table,
      slot,
      serviceDate: dto.date,
      partySize: dto.partySize,
      guestName: dto.guestName,
      guestEmail: dto.guestEmail,
      status: BookingStatus.pending,
      bookingCode: randomCode(8),
      depositRequiredCents: 0,
      minSpendCents: table.minSpendCents,
    });

    return this.bookings.save(booking);
  }

  async getByCode(code: string) {
    const booking = await this.bookings.findOne({
      where: { bookingCode: code },
      relations: { table: true, slot: true },
    });
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }
}
