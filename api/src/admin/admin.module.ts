import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TableEntity } from '../entities/table.entity';
import { TimeSlot } from '../entities/time-slot.entity';
import { BlackoutDate } from '../entities/blackout-date.entity';
import { Booking } from '../entities/booking.entity';
import { AdminTablesController } from './tables/admin-tables.controller';
import { TablesService } from './tables/admin-tables.service';
import { AdminBlackoutsController } from './blackouts/admin-blackouts.controller';
import { BlackoutsService } from './blackouts/admin-blackouts.service';
import { AdminTimeSlotsController } from './time-slots/admin-time-slots.controller';
import { TimeSlotsService } from './time-slots/admin-time-slots.service';
import { AdminBookingsController } from './bookings/admin-bookings.controller';
import { BookingsService } from './bookings/admin-bookings.service';
import { RolesGuard } from '../auth/guards/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([TableEntity, TimeSlot, BlackoutDate, Booking]),
  ],
  providers: [
    TablesService,
    BlackoutsService,
    TimeSlotsService,
    BookingsService,
    RolesGuard,
  ],
  controllers: [
    AdminTablesController,
    AdminBlackoutsController,
    AdminTimeSlotsController,
    AdminBookingsController,
  ],
})
export class BackofficeModule {}
