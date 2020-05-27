import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CarPark } from "../../car-park/interfaces/car-park.interface";
import { CONSTANTS } from "../../config/constants";
import { CarParkService } from "../../database/services/car-park.service";
import { ParkingLotService } from "../../database/services/parking-lot.service";
import { ReservationService } from "../../database/services/reservation.service";
import { ParkingLot } from "../../parking-lot/interfaces/parking-lot.interface";
import { UtilsService } from "../../services/utils.service";
import { ReservationDto } from "../dto/reservation.dto";
import { Reservation } from "../interfaces/reservation.interface";
import moment = require("moment");
/**
 * This service is only being use by reservation module
 */
@Injectable()
export class ReservationLocalService {
    private parkingLots: ParkingLot[];
    private carParks: CarPark[];
    constructor(private reservationService: ReservationService,
        private carparkService: CarParkService,
        private utilsService: UtilsService,
        private parkingLotService: ParkingLotService) { }

    async getAvailableSlots(reservationDto: ReservationDto): Promise<any> {
        // Check the validity of booking time
        // If time is valid then we proceed to create booking otherwise
        // system will get most available slot and return to user
        let startTime: string = moment(reservationDto.start_time).format(CONSTANTS.DATE_FORMAT).toString();
        let endTime: string = moment(reservationDto.start_time).add(3, 'hours').format(CONSTANTS.DATE_FORMAT).toString();
        const carParkId: string = reservationDto.carParkId;
        const parkingLots: ParkingLot[] = await this.parkingLotService.findWithConditions(new Map().set('carParkId', { $in: [carParkId] }))
        const parkingLotIds: string[] = parkingLots.map((e) => e._id.toString())
        const reservations: Reservation[] = await this.fetchReservationsFromTimeToTime(startTime, endTime, parkingLotIds)
        // Filter all available slot
        let availableSlot: string;
        if (reservations.length > 0) {
            const availableSlots: string[] = parkingLotIds.filter((slot) => reservations.findIndex((e) => e.parkingLotId === slot) == -1)
            // IF all slot of given car park are fully booking
            if (!availableSlots || availableSlots.length == 0) {

                const recommended = await this.recommendSlots(startTime);
                // Find from selected time backward

                return {
                    available: false,
                    recommended
                };
            }
            // Else get the next available slot
            availableSlot = availableSlots[0];
        } else { // All slot in the car park are free, take 1 and return to user
            availableSlot = parkingLotIds[0];
        }

        const slot: ParkingLot = parkingLots.find((e) => e._id == availableSlot)

        return {
            available: true,
            data: {
                parking_lot_name: slot.name,
                parking_lot_code: slot.code,
                parking_lot_id: slot._id,
                start_time: startTime,
                end_time: endTime
            }
        }
    }

    async recommendSlots(startTime: string): Promise<any> {
        // Find all the bookings of the desired date
        // Get the most closest time and free slot to the given date
        this.carParks = await this.carparkService.findAll();
        const carParkIds = this.carParks.map((cp) => cp._id.toString())
        this.parkingLots = await this.parkingLotService.findWithConditions(new Map().set('carParkId', { $in: carParkIds }))
        const allParkingLotIds: string[] = this.parkingLots.map((e) => e._id.toString())
        let time = startTime;
        let found = false;
        let slotToward: any;
        let slotBackward: any;
        // find from selected time toward
        while (!found) {
            const nextTime: string = moment(time).add(3, 'hours').format(CONSTANTS.DATE_FORMAT);
            // Found available slot
            let foundParkingLot: ParkingLot = await this.getAvailableSlotOfTimeRange(time, nextTime, allParkingLotIds);
            if (foundParkingLot) {
                found = true;
                const foundCarPark = this.carParks.find((p) => p._id.toString() == foundParkingLot.carParkId)
                slotToward = {
                    start_time: time,
                    end_time: nextTime,
                    foundParkingLot,
                    foundCarPark
                }
                break;
            }
            time = moment(time).add(15, 'minutes').format(CONSTANTS.DATE_FORMAT);
        }
        // Find from selected time backward
        // reset pointer
        found = false
        time = moment(startTime).subtract(3, 'hours').format(CONSTANTS.DATE_FORMAT);
        while (!found || moment().isSameOrBefore(time)) {
            const nextTime: string = moment(time).add(3, 'hours').format(CONSTANTS.DATE_FORMAT);
            let foundParkingLot: ParkingLot = await this.getAvailableSlotOfTimeRange(time, nextTime, allParkingLotIds);
            if (foundParkingLot) {
                found = true;
                const foundCarPark = this.carParks.find((p) => p._id.toString() == foundParkingLot.carParkId)
                slotBackward = {
                    start_time: time,
                    end_time: nextTime,
                    foundParkingLot,
                    foundCarPark
                }
                break;
            }
            time = moment(time).subtract(15, 'minutes').format(CONSTANTS.DATE_FORMAT);
        }
        // get the nearest time found
        const originalEndTime = moment(startTime).add(3, 'hour').format(CONSTANTS.DATE_FORMAT);
        const diff1 = this.utilsService.timeDiffer(slotToward.start_time, slotToward.end_time, startTime, originalEndTime);
        const diff2 = this.utilsService.timeDiffer(slotBackward.start_time, slotBackward.end_time, startTime, originalEndTime);
        if (diff1 === diff2) {
            return [slotToward, slotBackward];
        }
        if (diff2 < diff1) {
            return [slotBackward];
        }
        return [slotToward];
    }

    async getAvailableSlotOfTimeRange(start_time: string, end_time: string, parkingLotIds: string[]) {
        const bookings: Reservation[] = await this.fetchReservationsFromTimeToTime(start_time, end_time, parkingLotIds);
        // Found available slot
        if (!bookings || bookings.length == 0) {
            return this.parkingLots[0]  // Get first parking lot in the list
        }
        const availableSlots: ParkingLot[] = this.parkingLots.filter((slot) => bookings.findIndex((e) => e.parkingLotId === slot._id.toString()) == -1)
        if (availableSlots && availableSlots.length > 0) {
            return availableSlots[0];
        }
        return null
    }

    async fetchReservationsFromTimeToTime(startTime: string, endTime: string, parkingLots: string[] = []): Promise<Reservation[]> {
        const cond: Map<any, any> = new Map<any, any>()
        const $or = [
            {
                start_time: { $lt: startTime },
                end_time: { $gt: startTime }
            },
            {
                start_time: { $gte: startTime },
                end_time: { $lte: endTime }
            },
            {
                start_time: { $lt: endTime },
                end_time: { $gt: endTime }
            }
        ]
        cond.set('$or', $or)
        if (parkingLots.length > 0) {
            cond.set('parkingLotId', { $in: parkingLots });
        }
        // Get all reservation of given car park from start time to end time
        return await this.reservationService.findWithConditions(cond);
    }

    async create(reservationDto: ReservationDto) {
        // Validate booking time
        const startTime = reservationDto.start_time;
        const endTime = moment(startTime).add(3, 'hours').format(CONSTANTS.DATE_FORMAT).toString()
        if (moment().isAfter(startTime)) {
            throw new HttpException('Booking time is in past', HttpStatus.NOT_ACCEPTABLE)
        }
        // get Available Slot
        const availableSlots = await this.getAvailableSlots(reservationDto);
        if (availableSlots.available) {
            const slot = availableSlots.data
            reservationDto.end_time = endTime;
            reservationDto.parkingLotId = slot.parking_lot_id
            const reservation: Reservation = await this.reservationService.create(reservationDto);
            return {
                booked: true,
                slot,
                reservationId: reservation._id,
                time: {
                    start_time: startTime,
                    end_time: endTime
                }
            }
        }
        return {
            booked: false,
            recommended: availableSlots.recommended
        }
    }

    async findAll(): Promise<Reservation[]> {
        return this.reservationService.findAll()
    }

    async clearDatabase() {
        return await this.reservationService.delete(new Map())
    }

    async findOne(id: string): Promise<any> {
        const reservations: Reservation[] = await this.reservationService.findWithConditions(new Map().set('_id', id));
        if (reservations && reservations.length > 0) {
            return reservations[0]
        }
        return null;
    }
} 