import { UsersService } from './../services/users.service';
import { ShowTimesService } from 'src/services/show-times.service';
import { CreateBookingDto } from './../models/booking.dto';
import { Controller, Get, Query, Req, Post, Body } from '@nestjs/common';
import { PagingDto } from 'src/constants/app.const';
import { BookingDto, GetPagingListBookingDto } from 'src/models/booking.dto';
import { BookingsService } from 'src/services/bookings.service';

@Controller('api/bookings')
export class BookingsController {
  constructor(
    private bookingService: BookingsService,
    private showTimesService: ShowTimesService,
    private usersService: UsersService,
  ) {}

  @Get()
  async getPagingList(
    @Req() req,
    @Query() params: GetPagingListBookingDto,
  ): Promise<PagingDto<BookingDto>> {
    return await this.bookingService.getPagingList(req.user.id, params);
  }

  @Post()
  async create(
    @Req() req,
    @Body() booking: CreateBookingDto,
  ): Promise<BookingDto> {
    const showTime = await this.showTimesService.getOne(+booking.showTimeId);
    const user = await this.usersService.findById(req.user.id);

    return await this.bookingService.create(booking, user, showTime);
  }
}
