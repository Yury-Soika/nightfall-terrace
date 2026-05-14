import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TableEntity, TableType } from '../../entities/table.entity';

export type CreateTableDto = {
  name: string;
  capacity: number;
  type: TableType;
  minSpendCents?: number;
  active?: boolean;
};

export type UpdateTableDto = Partial<CreateTableDto>;

@Injectable()
export class TablesService {
  constructor(
    @InjectRepository(TableEntity)
    private readonly tables: Repository<TableEntity>,
  ) {}

  list() {
    return this.tables.find({
      order: { createdAt: 'ASC' },
    });
  }

  async create(dto: CreateTableDto) {
    const table = this.tables.create({
      name: dto.name,
      capacity: dto.capacity,
      type: dto.type,
      minSpendCents: dto.minSpendCents ?? 0,
      active: dto.active ?? true,
    });
    return this.tables.save(table);
  }

  async update(id: string, dto: UpdateTableDto) {
    const table = await this.tables.findOne({
      where: { id },
    });
    if (!table) throw new NotFoundException('Table not found');
    Object.assign(table, dto);
    return this.tables.save(table);
  }

  async remove(id: string) {
    const table = await this.tables.findOne({
      where: { id },
    });
    if (!table) throw new NotFoundException('Table not found');
    await this.tables.remove(table);
    return { ok: true };
  }
}
