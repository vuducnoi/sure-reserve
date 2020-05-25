import { Module } from '@nestjs/common';
import { databaseProviders } from './database.provider';
import { PROVIDERS } from './providers'
import { SERVICES } from './services'
@Module({
    providers: [...databaseProviders, ...PROVIDERS, ...SERVICES],
    exports: [...databaseProviders, ...SERVICES]
})
export class DatabaseModule {}
