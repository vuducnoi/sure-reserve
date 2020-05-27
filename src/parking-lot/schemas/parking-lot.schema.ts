import * as mongoose from 'mongoose'

export const ParkingLotSchema = new mongoose.Schema({
    id: String,
    name: {type: String, required: true},
    carParkId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'CarPark'},
    code: {type: String, required: true}
})