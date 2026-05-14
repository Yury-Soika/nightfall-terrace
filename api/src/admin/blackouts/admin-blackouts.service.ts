import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlackoutDate } from '../../entities/blackout-date.entity';

export type CreateBlackoutDto = {
  date: string;
  reason?: string;
  startTime?: string | null; // HH:MM (optional)
  endTime?: string | null; // HH:MM (optional)
};

@Injectable()
export class BlackoutsService {
  constructor(
    @InjectRepository(BlackoutDate)
    private readonly blackouts: Repository<BlackoutDate>,
  ) {}

  list() {
    return this.blackouts.find({
      order: { date: 'ASC' },
    });
  }

  create(dto: CreateBlackoutDto) {
    return this.blackouts.save(
      this.blackouts.create({
        date: dto.date,
        startTime: dto.startTime ?? null,
        endTime: dto.endTime ?? null,
        reason: dto.reason ?? '',
      }),
    );
  }

  async remove(id: string) {
    const row = await this.blackouts.findOne({
      where: { id },
    });
    if (!row) throw new NotFoundException('Blackout not found');
    await this.blackouts.remove(row);
    return { ok: true };
  }
}
