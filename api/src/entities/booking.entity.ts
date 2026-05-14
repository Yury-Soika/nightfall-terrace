import { Column, Entity, ManyToOne, Index, JoinColumn } from 'typeorm';
import { BaseEntity } from '../db/base.entity';
import { TableEntity } from './table.entity';
import { TimeSlot } from './time-slot.entity';
import { User } from './user.entity';

export enum BookingStatus {
  pending = 'pending',
  confirmed = 'confirmed',
  cancelled = 'cancelled',
}

@Entity('bookings')
@Index(['bookingCode'], { unique: true })
export class Booking extends BaseEntity {
  @ManyToOne(() => TableEntity, (t) => t.bookings, { onDelete: 'RESTRICT' })
  table!: TableEntity;

  @ManyToOne(() => TimeSlot, { onDelete: 'RESTRICT' })
  slot!: TimeSlot;

  /** Calendar day of the reservation (YYYY-MM-DD). Slot rows use a template date (1970-01-01). */
  @Column({ type: 'date', nullable: true })
  serviceDate!: string | null;

  @ManyToOne(() => User, (u) => u.bookings, { nullable: true })
  @JoinColumn()
  guestUser?: User | null;

  @Column()
  guestName!: string;

  @Column()
  guestEmail!: string;

  @Column({ type: 'int' })
  partySize!: number;

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.pending })
  status!: BookingStatus;

  @Column()
  bookingCode!: string;

  @Column({ type: 'int', default: 0 })
  depositRequiredCents!: number;

  @Column({ type: 'int', default: 0 })
  minSpendCents!: number;
}
