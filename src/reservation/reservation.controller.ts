import { Body, Controller, Get, Post, Param, Delete } from '@nestjs/common';
import { ReservationDto } from './dto/reservation.dto';
import { Reservation } from './interfaces/reservation.interface';
import { ReservationLocalService } from './services/reservation.local.service';
@Controller('reservation')
export class ReservationController {
    constructor(private reservationService: ReservationLocalService) { }
    @Get()
    findAll(): Promise<Reservation[]> {
        return this.reservationService.findAll();
    }
    @Get(':id')
    findOne(@Param('id') id): Promise<any> {
        return this.reservationService.findOne(id)
    }

    @Delete()
    async clearDatabase(): Promise<any> {
        return await this.reservationService.clearDatabase();
    }

    @Post()
    async create(@Body() reservationDto: ReservationDto): Promise<any> {
        return await this.reservationService.create(reservationDto);
    }
}