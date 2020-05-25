import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { ParkingLot } from '../../parking-lot/interfaces/parking-lot.interface';
import { CONSTANTS } from '../../config/constants';
import { ParkingLotDto } from '../../parking-lot/dto/parking-lot.dto';

@Injectable()
export class ParkingLotService {
    constructor(
        @Inject(CONSTANTS.PARKING_LOT_MODEL) private parkingLotModel: Model<ParkingLot>){}

    async create(parkingLotDto: ParkingLotDto): Promise<ParkingLot> {
        const createdItem = new this.parkingLotModel(parkingLotDto);
        return createdItem.save();
    }

    async findAll(carParkId: string): Promise<ParkingLot[]> {
        return this.parkingLotModel.find({carParkId}).exec();
    }

    async findWithConditions(conditions: Map<any, any>): Promise<ParkingLot[]> {
        if (!conditions) {
            throw new Error('Conditions could not be null');
        }
        let criteria = {};
        let entries = conditions.entries();
        for (const [key, value] of entries) {
            criteria[key] = value
        }
        return this.parkingLotModel.find(criteria).exec();
    }
}