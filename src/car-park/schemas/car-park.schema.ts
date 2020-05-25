import * as mongoose from 'mongoose'

export const CarParkSchema = new mongoose.Schema({
    id: String,
    name: String,
    code: {type: String, unique: true}
})