import { Branch } from './branch.entity';
import { ShowTime } from './show-time.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Cinema {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  horizontalSize: number;

  @Column()
  verticalSize: number;

  @ManyToOne(() => Branch, (branch) => branch.cinemas)
  branch: Branch;

  @OneToMany(() => ShowTime, (showTime) => showTime.cinema)
  showTimes: ShowTime;

	@Column({ default: false })
	deleted: boolean;
}
