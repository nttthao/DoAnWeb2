import {
  Entity,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Booking } from './booking.entity';
import { Cinema } from './cinema.entity';
import { Movie } from './movie.entity';

@Entity()
export class ShowTime {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  startAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  endAt: Date;

  @ManyToOne(() => Cinema, (cinema) => cinema.showTimes)
  cinema: Cinema;

  @ManyToOne(() => Movie, (movie) => movie.showTimes)
  movie: Movie;

  @OneToMany(() => Booking, (booking) => booking.showTime)
  bookings: Booking[];
}
