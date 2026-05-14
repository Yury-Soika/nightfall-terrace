import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/roles';
import { UserRole } from '../../entities/user.entity';
import { BookingsService } from './admin-bookings.service';

@Controller('admin/bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.admin, UserRole.manager, UserRole.host)
export class AdminBookingsController {
  constructor(private readonly bookings: BookingsService) {}

  @Get()
  async list() {
    return this.bookings.list();
  }

  @Patch(':id/confirm')
  async confirm(@Param('id') id: string) {
    return this.bookings.confirm(id);
  }

  @Patch(':id/cancel')
  async cancel(@Param('id') id: string) {
    return this.bookings.cancel(id);
  }
}
