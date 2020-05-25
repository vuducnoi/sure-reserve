import { Connection } from 'mongoose'
import { CarParkSchema } from '../../car-park/schemas/car-park.schema'
import { CONSTANTS } from '../../config/constants'

export const carParkProviders = [
    {
        provide: CONSTANTS.CAR_PARK_MODEL,
        useFactory: (connection: Connection) => connection.model('CarPark', CarParkSchema),
        inject: [CONSTANTS.MONGODB_CONNECTION]
    }
]