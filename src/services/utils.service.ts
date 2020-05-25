import { Injectable } from "@nestjs/common";
import * as moment from 'moment'
@Injectable()
export class UtilsService {
    public timeDiffer(startTime1: string, endTime1: string, startTime2: string, endTime2: string): number {
        if (moment(endTime1).isSameOrBefore(startTime2)) {
            return moment(endTime1).diff(startTime2, 'minutes')
        }
        return moment(startTime2).diff(startTime1, 'minutes')
    }
 }