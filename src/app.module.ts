import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CarParkModule } from './car-park/car-park.module';
import { ParkingLotModule } from './parking-lot/parking-lot.module';
import { ReservationModule } from './reservation/reservation.module';
import { DatabaseModule } from './database/database.module';
@Module({
  imports: [
    CarParkModule, 
    ParkingLotModule,
    DatabaseModule,
    ReservationModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}

//qzk#2n
