import { User } from './../entities/user.entity';
import { ShowTime } from './../entities/show-time.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PagingDto } from 'src/constants/app.const';
import { Booking } from 'src/entities/booking.entity';
import {
  BookingDto,
  CreateBookingDto,
  GetPagingListBookingDto,
} from 'src/models/booking.dto';
import { Repository } from 'typeorm';
import { Ticket } from 'src/entities/ticket.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
  ) {}

  async getPagingList(
    userId: string,
    params: GetPagingListBookingDto,
  ): Promise<PagingDto<BookingDto>> {
    const total = await await this.bookingsRepository
      .createQueryBuilder('booking')
      .where(`booking.userId = ${userId}`)
      .getCount();

    const bookings = await this.bookingsRepository
      .createQueryBuilder('booking')
      .where(`booking.userId = ${userId}`)
      .leftJoinAndSelect('booking.tickets', 'tickets')
      .leftJoinAndSelect('booking.showTime', 'showTime')
      .leftJoinAndSelect('showTime.movie', 'movie')
      .leftJoinAndSelect('showTime.cinema', 'cinema')
      .leftJoinAndSelect('cinema.branch', 'branch')
      .orderBy('booking.at', 'DESC')
      .skip((params.page - 1) * params.size)
      .take(params.size)
      .getMany();

    return new PagingDto<BookingDto>(
      params.page,
      params.size,
      total,
      bookings.map((item) => new BookingDto(item)),
    );
  }

  async create(
    bookingDto: CreateBookingDto,
    user: User,
    showTime: ShowTime,
  ): Promise<BookingDto> {
    const booking = new Booking();
    booking.at = new Date();
    booking.user = user;
    booking.showTime = showTime;
    booking.totalMoney = bookingDto.tickets.reduce((a, b) => a + b.price, 0);
    booking.tickets = bookingDto.tickets.map((item) => {
      const ticket = new Ticket();
      ticket.price = item.price;
      ticket.seat = item.seat;
      return ticket;
    });

    const result = await this.bookingsRepository.save(booking);

    return new BookingDto(result);
  }
}
