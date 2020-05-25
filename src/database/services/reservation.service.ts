import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { Reservation } from '../../reservation/interfaces/reservation.interface';
import { CONSTANTS } from '../../config/constants';
import { ReservationDto } from '../../reservation/dto/reservation.dto';

@Injectable()
export class ReservationService {
    constructor(
        @Inject(CONSTANTS.RESERVATION_MODEL) private reservationModel: Model<Reservation>){}

    async create(reservationDto: ReservationDto): Promise<Reservation> {
        const createdItem = new this.reservationModel(reservationDto);
        return createdItem.save();
    }

    async findAll(): Promise<Reservation[]> {
        return this.findWithConditions(new Map());
    }

    async delete(conditions: Map<any, any>): Promise<any> {
        if (!conditions) {
            throw new Error('Conditions could not be null');
        }
        let criteria = {};
        let entries = conditions.entries();
        for (const [key, value] of entries) {
            criteria[key] = value
        }
        return await this.reservationModel.deleteMany(criteria)
    }

    async findWithConditions(conditions: Map<any, any>): Promise<Reservation[]> {
        if (!conditions) {
            throw new Error('Conditions could not be null');
        }
        let criteria = {};
        let entries = conditions.entries();
        for (const [key, value] of entries) {
            criteria[key] = value
        }
        return this.reservationModel.find(criteria).exec();
    }
}