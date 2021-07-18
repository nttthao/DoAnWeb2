import { CreateBranchDto } from './../models/branch.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Branch } from 'src/entities/branch.entity';
import { BranchDto } from 'src/models/branch.dto';
import { Repository } from 'typeorm';

@Injectable()
export class BranchesService {
	constructor(
		@InjectRepository(Branch)
		private branchesRepository: Repository<Branch>
	) {}

	async getList(): Promise<BranchDto[]> {
		const branches = await this.branchesRepository.find({
			where: { deleted: false },
			relations: ['cinemas'],
		});

		return branches.map((item) => new BranchDto(item));
	}

	async get(id: number): Promise<BranchDto> {
		const branch = await this.branchesRepository.findOne({
			where: { id: +id, deleted: false },
			relations: ['cinemas'],
		});

		return new BranchDto(branch);
	}

	async create(dto: CreateBranchDto): Promise<BranchDto> {
		const movie = await this.branchesRepository.save(dto);
		return new BranchDto(movie);
	}

	async delete(id: any): Promise<void> {
		const branch = await this.branchesRepository.findOne({ where: { id } });
		await this.branchesRepository.save({ ...branch, deleted: true });
	}
}
