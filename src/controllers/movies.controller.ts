import { Controller, Get, Query, Post, Body, Delete, Param } from '@nestjs/common';
import { PagingDto, Public } from 'src/constants/app.const';
import { CreateMovieDto, GetPagingListMovieDto, MovieDto } from 'src/models/movie.dto';
import { MoviesService } from 'src/services/movies.service';

@Controller('api/movies')
export class MoviesController {
	constructor(private movieService: MoviesService) {}

	@Get()
	@Public()
	async getPagingList(@Query() params: GetPagingListMovieDto): Promise<PagingDto<MovieDto>> {
		return await this.movieService.getPagingList(params);
	}

	@Post()
	async create(@Body() dto: CreateMovieDto): Promise<MovieDto> {
		return await this.movieService.create(dto);
	}

	@Delete(':id')
	async delete(@Param() params): Promise<void> {
		await this.movieService.delete(params.id);
	}
}
