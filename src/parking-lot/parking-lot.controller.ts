import {Controller, Get, Post, Body, Query} from '@nestjs/common'
import { ParkingLot } from './interfaces/parking-lot.interface'
import { ParkingLotDto } from './dto/parking-lot.dto'
import { ParkingLotService } from '../database/services/parking-lot.service';
@Controller('parking-lot')
export class ParkingLotController {
    constructor(private parkingLotService: ParkingLotService){}
    @Get()
    findAll(@Query('car-park-id') carParkId): Promise<ParkingLot[]> {
        return this.parkingLotService.findAll(carParkId);
    }

    @Post()
    async create(@Body() carParkDto: ParkingLotDto): Promise<ParkingLot> {
        return await this.parkingLotService.create(carParkDto);
    } 
}