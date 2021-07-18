import { Branch } from './../entities/branch.entity';
import { GetReportDto, ReportDto, BranchReportDto, MovieReportDto } from './../models/report.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShowTime } from '../entities/show-time.entity';

@Injectable()
export class ReportsService {
	constructor(
		@InjectRepository(ShowTime)
		private showTimesRepository: Repository<ShowTime>,

		@InjectRepository(Branch)
		private branchesRepository: Repository<Branch>
	) {}

	async get(params: GetReportDto): Promise<ReportDto> {
		const condition: string[] = [];
		if (params.startDate) {
			condition.push(`show_time.startAt >= '${new Date(params.startDate).toISOString()}'::date`);
		}
		if (params.endDate) {
			const date = new Date(params.endDate);
			condition.push(`show_time.startAt < '${new Date(date.getTime() + 1000 * 60 * 60 * 24).toISOString()}'::date`);
		}

		const whereQuery = condition.join(' and ');
		const showTimes = await this.showTimesRepository
			.createQueryBuilder('show_time')
			.leftJoinAndSelect('show_time.bookings', 'bookings')
			.leftJoinAndSelect('show_time.cinema', 'cinema')
			.leftJoinAndSelect('cinema.branch', 'branch')
			.leftJoinAndSelect('show_time.movie', 'movie')
			.where(whereQuery || '1 = 1')
			.getMany();

		let movies = [...new Map(showTimes.map((item) => item.movie).map((item) => [item.id, item])).values()];
		let branches = await this.branchesRepository.find({ where: { deleted: false } });

		const movieReport = movies.map((item) => {
			const sts = showTimes.filter((st) => st.movie.id === item.id);
			return new MovieReportDto({
				...item,
				tickets: sts.reduce((a, b) => a + b.bookings.length, 0),
				revenue: sts.reduce((a, b) => a + b.bookings.reduce((c, d) => c + d.totalMoney, 0), 0),
			});
		});

		const branchReport = branches.map((item) => {
			const sts = showTimes.filter((st) => st.cinema.branch.id === item.id);
			return new BranchReportDto({
				...item,
				tickets: sts.reduce((a, b) => a + b.bookings.length, 0),
				revenue: sts.reduce((a, b) => a + b.bookings.reduce((c, d) => c + d.totalMoney, 0), 0),
			});
		});

		return new ReportDto(movieReport, branchReport);
	}
}
