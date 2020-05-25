import { Module } from '@nestjs/common';
import { CarParkController } from './car-park.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  controllers: [CarParkController],
  providers: [],
  imports: [DatabaseModule]
})
export class CarParkModule {}
