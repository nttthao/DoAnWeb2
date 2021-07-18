import { ShowTime } from './show-time.entity';
import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Movie {
	@PrimaryGeneratedColumn('increment')
	id: number;

	@Column()
	name: string;

	@Column({ default: 13 })
	age: number;

	@CreateDateColumn({ type: 'timestamp' })
	publishAt: Date;

	@Column()
	posterUrl: string;

	@Column()
	duration: number;

	@OneToMany(() => ShowTime, (showTime) => showTime.movie)
	showTimes: ShowTime[];

	@Column({ default: false })
	deleted: boolean;
}
