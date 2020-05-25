import {Document} from "mongoose";

export interface ParkingLot extends Document{
    id?: String,
    carParkId: String,
    name: String,
    code: String
  }