import {Document} from "mongoose";

export interface CarPark extends Document{
    id?: String,
    name: String,
    code: String
  }