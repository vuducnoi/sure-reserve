import * as mongoose from 'mongoose'

export const ParkingLotSchema = new mongoose.Schema({
    id: String,
    name: {type: String, required: true},
    carParkId: {type: String, required: true},
    code: {type: String, required: true}
})