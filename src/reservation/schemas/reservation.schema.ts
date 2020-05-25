import * as mongoose from 'mongoose'

export const ReservationSchema = new mongoose.Schema({
    id: String,
    start_time: {type: String, required: true},
    end_time: String,
    parkingLotId: {required: true, type: String},
    createdAt: {
        type: Date,
        default: Date.now
    }
})