import { Column, Entity, OneToMany, Index } from 'typeorm';
import { BaseEntity } from '../db/base.entity';
import { Booking } from './booking.entity';

export enum TableType {
  booth = 'booth',
  table = 'table',
  bar = 'bar',
  vip = 'vip',
}

@Entity('tables')
@Index(['name'], { unique: true })
export class TableEntity extends BaseEntity {
  @Column()
  name!: string;

  @Column({ type: 'int' })
  capacity!: number;

  @Column({ type: 'enum', enum: TableType, default: TableType.table })
  type!: TableType;

  @Column({ type: 'int', default: 0 })
  minSpendCents!: number;

  @Column({ default: true })
  active!: boolean;

  @OneToMany(() => Booking, (b) => b.table)
  bookings!: Booking[];
}
