import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { AppRoles } from '../constants/role.const';
import { Booking } from './booking.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ default: false })
  isActive: boolean;

  @Column({ nullable: true })
  activationCode: string;

  @Column({ default: AppRoles.User })
  role: string;

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];
}
