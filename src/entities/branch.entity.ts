import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Cinema } from './cinema.entity';

@Entity()
export class Branch {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @OneToMany(() => Cinema, (cinema) => cinema.branch, { cascade: true })
  cinemas: Cinema[];

	@Column({ default: false })
	deleted: boolean;
}
