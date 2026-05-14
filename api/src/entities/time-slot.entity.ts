import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../db/base.entity';

@Entity('time_slots')
@Index(['date', 'startTime'], { unique: true })
export class TimeSlot extends BaseEntity {
  // Used as a template slot that's available every day.
  // We store it with a fixed date to keep the existing schema + booking relation.
  @Column({ type: 'date' })
  date!: string;

  // HH:MM 24h
  @Column()
  startTime!: string;

  @Column()
  endTime!: string;

  @Column({ default: true })
  active!: boolean;
}
