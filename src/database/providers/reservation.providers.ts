import * as mongoose from 'mongoose'
import { ReservationSchema } from '../../reservation/schemas/reservation.schema'
import { CONSTANTS } from '../../config/constants'
import * as moment from 'moment'
import { Reservation } from '../../reservation/interfaces/reservation.interface'

export const reservationProviders = [
    {
        provide: CONSTANTS.RESERVATION_MODEL,
        useFactory: (connection: mongoose.Connection) =>  {
            ReservationSchema.pre<Reservation>('save', function(next) {
                const start_time = this.start_time;
                this.end_time = moment(start_time).add(3, 'hours').format(CONSTANTS.DATE_FORMAT).toString();
                this.start_time = moment(start_time).format(CONSTANTS.DATE_FORMAT).toString();
                next();
            })

            return connection.model('Reservation', ReservationSchema)
        },
        inject: [CONSTANTS.MONGODB_CONNECTION]
    }
]

//connection.model('Reservation', ReservationSchema)