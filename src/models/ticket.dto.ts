import { Ticket } from './../entities/ticket.entity';
export class TicketDto {
  id: number;
  seat: string;
  price: number;

  constructor(entity: Ticket) {
    this.id = entity.id;
    this.seat = entity.seat;
    this.price = entity.price;
  }
}
