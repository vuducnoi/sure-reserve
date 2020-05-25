// import { minLength } from 'class-validator'
export class ParkingLotDto {
    readonly id?: string;
    readonly carParkId: string;
    readonly name: string;
    readonly code: string;
}