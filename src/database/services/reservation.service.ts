import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { Reservation } from '../../reservation/interfaces/reservation.interface';
import { CONSTANTS } from '../../config/constants';
import { ReservationDto } from '../../reservation/dto/reservation.dto';
import { UtilsService } from '../../services/utils.service';

@Injectable()
export class ReservationService {
    constructor(
        @Inject(CONSTANTS.RESERVATION_MODEL) private reservationModel: Model<Reservation>, private utilsService: UtilsService){}

    async create(reservationDto: ReservationDto): Promise<Reservation> {
        reservationDto.timeSpan = this.utilsService.generateTimeSpan(reservationDto.start_time, reservationDto.end_time)
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
        return this.reservationModel.find(criteria).populate({
            path: 'parkingLotId',
            as: 'parkingLot',
            populate: {
                path: 'carParkId',
                as: 'carPark'
            }
        }).exec();
    }
}