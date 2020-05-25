import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ParkingLotController } from './parking-lot.controller';

@Module({
    controllers: [ParkingLotController],
    imports: [ 
        DatabaseModule
    ],
    
    providers: [],
    exports: []
})
export class ParkingLotModule {}
