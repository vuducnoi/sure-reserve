import { Injectable } from "@nestjs/common";
import * as moment from 'moment'
import { CONSTANTS } from "../config/constants";
@Injectable()
export class UtilsService {
    public timeDiffer(startTime1: string, endTime1: string, startTime2: string, endTime2: string): number {
        if (moment(endTime1).isSameOrBefore(startTime2)) {
            return moment(endTime1).diff(startTime2, 'minutes')
        }
        return moment(startTime2).diff(startTime1, 'minutes')
    }

    public generateTimeSpan(startTime: string, endTime: string): string[] {
        let timeSpan: string[] = []
        let begin = moment(startTime).add(1, 'minute');
        timeSpan.push(begin.format(CONSTANTS.DATE_FORMAT))
        begin = begin.add(14, 'minutes')
        while(begin.isBefore(endTime)) {
            timeSpan.push(begin.format(CONSTANTS.DATE_FORMAT))
            begin.add(15, 'minutes');
        }
        let end = moment(endTime).subtract(1, 'minute');
        timeSpan.push(end.format(CONSTANTS.DATE_FORMAT))
        return timeSpan;
    }
 }