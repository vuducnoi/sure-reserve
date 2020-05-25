import {Controller, Get, Post, Body} from '@nestjs/common'
import { CarPark } from './interfaces/car-park.interface'
import { CarParkDto } from './dto/car-park.dto'
import { CarParkService } from '../database/services/car-park.service';
@Controller('car-park')
export class CarParkController {
    constructor(private carParkService: CarParkService){}
    @Get()
    findAll(): Promise<CarPark[]> {
        return this.carParkService.findAll();
    }

    @Post()
    async create(@Body() carParkDto: CarParkDto): Promise<CarPark> {
        return await this.carParkService.create(carParkDto);
    } 
}