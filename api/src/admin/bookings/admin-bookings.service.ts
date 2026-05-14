import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingStatus } from '../../entities/booking.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking) private readonly bookings: Repository<Booking>,
  ) {}

  list() {
    return this.bookings.find({
      order: { createdAt: 'DESC' },
      relations: { table: true, slot: true },
      take: 200,
    });
  }

  async confirm(id: string) {
    const booking = await this.bookings.findOne({ where: { id } });
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.status !== BookingStatus.pending) {
      throw new BadRequestException('Only pending bookings can be confirmed');
    }
    booking.status = BookingStatus.confirmed;
    return this.bookings.save(booking);
  }

  async cancel(id: string) {
    const booking = await this.bookings.findOne({
      where: { id },
    });
    if (!booking) throw new NotFoundException('Booking not found');
    booking.status = BookingStatus.cancelled;
    return this.bookings.save(booking);
  }
}
