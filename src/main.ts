import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from 'morgan'
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(morgan('combined'))
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204
  })
  await app.listen(3001);
}
bootstrap();
