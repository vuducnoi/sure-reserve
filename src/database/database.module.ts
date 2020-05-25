import { Module } from '@nestjs/common';
import { databaseProviders } from './database.provider';
import { PROVIDERS } from './providers'
import { SERVICES } from './services'
import { ServiceModule } from '../services/services.module';
@Module({
    imports: [ServiceModule],
    providers: [...databaseProviders, ...PROVIDERS, ...SERVICES],
    exports: [...databaseProviders, ...SERVICES]
})
export class DatabaseModule {}
