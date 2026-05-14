import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/roles';
import { UserRole } from '../../entities/user.entity';
import { BlackoutsService } from './admin-blackouts.service';
import type { CreateBlackoutDto } from './admin-blackouts.service';

@Controller('admin/blackouts')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.admin, UserRole.manager)
export class AdminBlackoutsController {
  constructor(private readonly blackouts: BlackoutsService) {}

  @Get()
  async list() {
    return this.blackouts.list();
  }

  @Post()
  async create(@Body() body: CreateBlackoutDto) {
    return this.blackouts.create(body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.blackouts.remove(id);
  }
}
