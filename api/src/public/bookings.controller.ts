import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import type { CreateBookingDto } from './bookings.service';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookings: BookingsService) {}

  @Post()
  create(@Body() body: CreateBookingDto) {
    return this.bookings.create(body);
  }

  @Get(':code')
  get(@Param('code') code: string) {
    return this.bookings.getByCode(code);
  }
}
