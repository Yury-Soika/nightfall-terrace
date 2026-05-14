import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TimeSlot } from '../../entities/time-slot.entity';

export type CreateTimeSlotDto = {
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  active?: boolean;
};

export type UpdateTimeSlotDto = Partial<CreateTimeSlotDto>;

const TEMPLATE_DATE = '1970-01-01';

@Injectable()
export class TimeSlotsService {
  constructor(
    @InjectRepository(TimeSlot)
    private readonly slots: Repository<TimeSlot>,
  ) {}

  list() {
    return this.slots.find({
      where: { date: TEMPLATE_DATE },
      order: { startTime: 'ASC' },
      take: 200,
    });
  }

  create(dto: CreateTimeSlotDto) {
    const slot = this.slots.create({
      date: TEMPLATE_DATE,
      startTime: dto.startTime,
      endTime: dto.endTime,
      active: dto.active ?? true,
    });
    return this.slots.save(slot);
  }

  async update(id: string, dto: UpdateTimeSlotDto) {
    const slot = await this.slots.findOne({
      where: { id },
    });
    if (!slot) throw new NotFoundException('Time slot not found');
    Object.assign(slot, dto);
    return this.slots.save(slot);
  }

  async remove(id: string) {
    const slot = await this.slots.findOne({
      where: { id },
    });
    if (!slot) throw new NotFoundException('Time slot not found');
    await this.slots.remove(slot);
    return { ok: true };
  }
}
