import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../db/base.entity';
import { Booking } from './booking.entity';

export enum UserRole {
  admin = 'admin',
  manager = 'manager',
  host = 'host',
}

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  email!: string;

  @Column()
  passwordHash!: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.host })
  role!: UserRole;

  @OneToMany(() => Booking, (b) => b.guestUser)
  bookings!: Booking[];
}
