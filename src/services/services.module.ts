import { Module } from "@nestjs/common";
import { UtilsService } from './utils.service'
const SERVICES = [UtilsService]
@Module({
    providers: [...SERVICES],
    exports: [...SERVICES]
})
export class ServiceModule {}