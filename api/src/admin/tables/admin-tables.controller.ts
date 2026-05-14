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
import { TablesService } from './admin-tables.service';
import type { CreateTableDto, UpdateTableDto } from './admin-tables.service';

@Controller('admin/tables')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.admin, UserRole.manager, UserRole.host)
export class AdminTablesController {
  constructor(private readonly tables: TablesService) {}

  @Get()
  async list() {
    return this.tables.list();
  }

  @Post()
  async create(@Body() body: CreateTableDto) {
    return this.tables.create(body);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateTableDto) {
    return this.tables.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.tables.remove(id);
  }
}
