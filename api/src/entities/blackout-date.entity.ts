import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../db/base.entity';

@Entity('blackout_dates')
@Index(['date', 'startTime', 'endTime'], { unique: true })
export class BlackoutDate extends BaseEntity {
  @Column({ type: 'date' })
  date!: string;

  // Optional time range block for the date (HH:MM). If both are null => full-day blackout.
  @Column({ type: 'varchar', nullable: true })
  startTime?: string | null;

  @Column({ type: 'varchar', nullable: true })
  endTime?: string | null;

  @Column({ default: '' })
  reason!: string;
}
