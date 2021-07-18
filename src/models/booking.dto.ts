import { ApiProperty } from '@nestjs/swagger';
import { Booking } from 'src/entities/booking.entity';
import { ShowTimeDto } from './show-time.dto';
import { TicketDto } from './ticket.dto';

export class BookingDto {
  id: number;
  at: Date;
  totalMoney: number;
  showTime: ShowTimeDto;
  tickets: TicketDto[];

  constructor(entity: Booking) {
    this.id = entity.id;
    this.at = entity.at;
    this.totalMoney = entity.totalMoney;
    this.showTime = entity.showTime && new ShowTimeDto(entity.showTime);
    this.tickets = entity.tickets.map((item) => new TicketDto(item));
  }
}

export class GetPagingListBookingDto {
  @ApiProperty({ type: Number, default: 1, required: false })
  public page = 1;
  @ApiProperty({ type: Number, default: 10, required: false })
  public size = 10;
}

export class CreateBookingTicketDto {
  @ApiProperty()
  public seat: string;
  @ApiProperty()
  public price: number;
}

export class CreateBookingDto {
  @ApiProperty()
  public showTimeId: string;
  @ApiProperty({ type: CreateBookingTicketDto })
  public tickets: CreateBookingTicketDto[];
}
