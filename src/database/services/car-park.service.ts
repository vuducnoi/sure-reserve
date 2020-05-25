import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { CarPark } from '../../car-park/interfaces/car-park.interface';
import { CONSTANTS } from '../../config/constants';
import { CarParkDto } from '../../car-park/dto/car-park.dto';

@Injectable()
export class CarParkService {
    constructor(@Inject(CONSTANTS.CAR_PARK_MODEL) private carParkModel: Model<CarPark>) { }

    async create(carParkDto: CarParkDto): Promise<CarPark> {
        const createdItem = new this.carParkModel(carParkDto);
        return createdItem.save();
    }

    async findAll(): Promise<CarPark[]> {
        return this.carParkModel.find().exec();
    }
    async findWithConditions(conditions: Map<any, any>): Promise<CarPark[]> {
        if (!conditions) {
            throw new Error('Conditions could not be null');
        }
        let criteria = {};
        let entries = conditions.entries();
        for (const [key, value] of entries) {
            criteria[key] = value
        }
        return this.carParkModel.find(criteria).exec();
    }
}