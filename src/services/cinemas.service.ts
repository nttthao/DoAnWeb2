import { Cinema } from 'src/entities/cinema.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CinemasService {
	constructor(
		@InjectRepository(Cinema)
		private cinemaRepository: Repository<Cinema>
	) {}

	async delete(id: any): Promise<void> {
		const branch = await this.cinemaRepository.findOne({ where: { id } });
		await this.cinemaRepository.save({ ...branch, deleted: true });
	}
}
