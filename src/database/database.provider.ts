import * as mongoose from 'mongoose'
import config from '../config'
import { CONSTANTS } from '../config/constants'

export const databaseProviders = [
    {
        provide: CONSTANTS.MONGODB_CONNECTION,
        useFactory: (): Promise<typeof mongoose> => 
            mongoose.connect(config.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true}),
    }
]