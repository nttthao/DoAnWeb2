import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Booking } from './booking.entity';

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  seat: string;

  @Column()
  price: number;

  @ManyToOne(() => Booking, (booking) => booking.tickets)
  booking: Booking;
}
