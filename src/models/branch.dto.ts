import { Branch } from './../entities/branch.entity';
import { CinemaDto, CreateCinemaDto } from './cinema.dto';

export class BranchDto {
	id: number;
	name: string;
	address: string;
	cinemas: CinemaDto[];

	constructor(entity: Branch) {
		this.id = entity.id;
		this.name = entity.name;
		this.address = entity.address;
		this.cinemas = entity.cinemas.filter(item => !item.deleted).map((item) => new CinemaDto(item));
	}
}
export class CreateBranchDto {
	name: string;
	address: string;
	cinemas: CreateCinemaDto[];
}
