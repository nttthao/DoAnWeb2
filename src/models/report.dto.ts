import { ApiProperty } from '@nestjs/swagger';

export class GetReportDto {
	@ApiProperty({ type: Date, required: true })
	startDate: Date;
	@ApiProperty({ type: Date, required: true })
	endDate: Date;
}

export class ReportDto {
	movies: MovieReportDto[];
	branches: BranchReportDto[];

	constructor(movies: MovieReportDto[], branches: BranchReportDto[]) {
		this.movies = movies;
		this.branches = branches;
	}
}

export class MovieReportDto {
	id: number;
	name: number;
	tickets: number;
	revenue: number;

	constructor(data: any) {
		this.id = data.id;
		this.name = data.name;
		this.tickets = data.tickets;
		this.revenue = data.revenue;
	}
}

export class BranchReportDto {
	id: number;
	name: number;
	tickets: number;
	revenue: number;

	constructor(data: any) {
		this.id = data.id;
		this.name = data.name;
		this.tickets = data.tickets;
		this.revenue = data.revenue;
	}
}
