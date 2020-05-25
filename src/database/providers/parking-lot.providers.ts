import { Connection } from 'mongoose'
import { ParkingLotSchema } from '../../parking-lot/schemas/parking-lot.schema'
import { CONSTANTS } from '../../config/constants'

export const parkingLotProviders = [
    {
        provide: CONSTANTS.PARKING_LOT_MODEL,
        useFactory: (connection: Connection) => {
            ParkingLotSchema.index({ code: 1, carParkId: 1 }, { unique: true })
            return connection.model('ParkingLot', ParkingLotSchema)
        },
        inject: [CONSTANTS.MONGODB_CONNECTION]
    }
]