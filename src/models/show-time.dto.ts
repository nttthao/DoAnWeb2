import { ApiProperty } from '@nestjs/swagger';
import { Cinema } from 'src/entities/cinema.entity';
import { Movie } from 'src/entities/movie.entity';
import { ShowTime } from 'src/entities/show-time.entity';
import { BookingDto } from './booking.dto';

export class GetListShowTimeDto {
	@ApiProperty({ type: Date, required: false })
	public startTime: Date;
	@ApiProperty({ type: Date, required: false })
	public endTime: Date;
	@ApiProperty({ type: Number, required: false })
	public movieId: number;
	@ApiProperty({ type: Number, required: false })
	public branchId: number;
	@ApiProperty({ type: Number, required: false })
	public cinemaId: number;
}

export class ShowTimeDto {
	id: number;
	startAt: Date;
	endAt: Date;
	cinema: Cinema;
	movie: Movie;
	bookings: BookingDto[];

	constructor(show: ShowTime) {
		this.id = show.id;
		this.startAt = show.startAt;
		this.endAt = show.endAt;
		this.cinema = show.cinema;
		this.movie = show.movie;
		this.bookings = show.bookings?.map((item) => new BookingDto(item));
	}
}

export class CreateShowTimeDto {
	startAt: Date;
	endAt: Date;
	cinemaId: number;
	movieId: number;
}
