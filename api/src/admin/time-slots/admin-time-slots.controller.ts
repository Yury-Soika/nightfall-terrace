import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/roles';
import { UserRole } from '../../entities/user.entity';
import { TimeSlotsService } from './admin-time-slots.service';
import type {
  CreateTimeSlotDto,
  UpdateTimeSlotDto,
} from './admin-time-slots.service';

@Controller('admin/time-slots')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.admin, UserRole.manager, UserRole.host)
export class AdminTimeSlotsController {
  constructor(private readonly slots: TimeSlotsService) {}

  @Get()
  async list() {
    return this.slots.list();
  }

  @Post()
  async create(@Body() body: CreateTimeSlotDto) {
    return this.slots.create(body);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateTimeSlotDto) {
    return this.slots.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.slots.remove(id);
  }
}
