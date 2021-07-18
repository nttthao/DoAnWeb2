import { MovieSortType } from 'src/constants/movie.const';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PagingDto } from 'src/constants/app.const';
import { CreateMovieDto, GetPagingListMovieDto, MovieDto } from 'src/models/movie.dto';
import { Repository } from 'typeorm';
import * as  moment from 'moment';
import { Movie } from '../entities/movie.entity';

@Injectable()
export class MoviesService {
	constructor(
		@InjectRepository(Movie)
		private moviesRepository: Repository<Movie>
	) {}

	async getPagingList(params: GetPagingListMovieDto): Promise<PagingDto<MovieDto>> {
		const date = params.showTimeFrom ? moment(params.showTimeFrom).utc().format('YYYY-MM-DD HH:mm:ss') : undefined;
		let builder = this.moviesRepository
			.createQueryBuilder('movie')
			.leftJoinAndSelect('movie.showTimes', 'showTime')
			.leftJoinAndSelect('showTime.bookings', 'booking')
			.where('movie.deleted = false')
			.andWhere(date ? `showTime.startAt >= '${date}'::timestamp` : '1=1');

		let movies = [];
		if (params.sort === MovieSortType.Name) {
			movies = await builder
				.orderBy('movie.name', 'ASC')
				.skip((params.page - 1) * params.size)
				.take(params.size)
				.getMany();
		}

		if (params.sort === MovieSortType.Newest) {
			movies = await builder
				.orderBy('movie.publishAt', 'DESC')
				.skip((params.page - 1) * params.size)
				.take(params.size)
				.getMany();
		}

		if (params.sort === MovieSortType.View) {
			movies = await builder
				.skip((params.page - 1) * params.size)
				.take(params.size)
				.getMany()
				.then((data) =>
					data
						.map((a) => ({
							...a,
							totalViews: a.showTimes.reduce((a, b) => a + b.bookings.length, 0),
						}))
						.sort((a, b) => b.totalViews - a.totalViews)
				);
		}

		const total = await builder.getCount();

		return new PagingDto<MovieDto>(
			params.page,
			params.size,
			total,
			movies.map((item) => new MovieDto(item))
		);
	}

	async create(dto: CreateMovieDto): Promise<MovieDto> {
		const movie = await this.moviesRepository.save(dto);
		return new MovieDto(movie);
	}

	async delete(id: any): Promise<void> {
		const movie = await this.moviesRepository.findOne({ where: { id } });
		await this.moviesRepository.save({ ...movie, deleted: true });
	}
}
