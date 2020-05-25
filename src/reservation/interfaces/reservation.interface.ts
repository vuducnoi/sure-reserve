import {Document} from "mongoose";

export interface Reservation extends Document{
    id?: string,
    parkingLotId: string,
    timeSpan: string[],
    start_time: string,
    end_time: string
  }