import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ReservationController } from './reservation.controller';
import { ReservationLocalService } from './services/reservation.local.service';
import { ServiceModule } from '../services/services.module';

@Module({
    controllers: [ReservationController],
    imports: [
        DatabaseModule,
        ServiceModule
    ],
    providers: [ReservationLocalService],
    exports: []
})
export class ReservationModule { }
