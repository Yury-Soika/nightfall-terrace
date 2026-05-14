import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TableEntity } from '../entities/table.entity';
import { TimeSlot } from '../entities/time-slot.entity';
import { Booking } from '../entities/booking.entity';
import { BlackoutDate } from '../entities/blackout-date.entity';
import { AvailabilityController } from './availability.controller';
import { AvailabilityService } from './availability.service';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TableEntity, TimeSlot, Booking, BlackoutDate]),
  ],
  controllers: [AvailabilityController, BookingsController],
  providers: [AvailabilityService, BookingsService],
})
export class PublicModule {}
