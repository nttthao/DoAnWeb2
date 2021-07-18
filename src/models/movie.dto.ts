import { ApiProperty } from '@nestjs/swagger';
import { MovieSortType } from 'src/constants/movie.const';
import { Movie } from 'src/entities/movie.entity';

export class GetPagingListMovieDto {
  @ApiProperty({ type: Number, default: 1, required: false })
  public page = 1;

  @ApiProperty({ type: Number, default: 10, required: false })
  public size = 10;

  @ApiProperty({
    required: false,
    enum: [MovieSortType.Name, MovieSortType.Newest, MovieSortType.View],
  })
  public sort: string = MovieSortType.Name;
  
  @ApiProperty({ type: Date, required: false })
  public showTimeFrom;
}

export class MovieDto {
  id: number;
  name: string;
  age: number;
  publishAt: Date;
  posterUrl: string;
  duration: number;

  constructor(movie: Movie) {
    this.id = movie.id;
    this.name = movie.name;
    this.age = movie.age;
    this.publishAt = movie.publishAt;
    this.posterUrl = movie.posterUrl;
    this.duration = movie.duration;
  }
}

export class CreateMovieDto {
  name: string;
  age: number;
  publishAt: Date;
  posterUrl: string;
  duration: number;
}
