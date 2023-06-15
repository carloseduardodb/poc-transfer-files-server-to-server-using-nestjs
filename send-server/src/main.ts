import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const server = await app.listen(3001);
  server.setTimeout(50000000);
  setInterval(() => {
    const memoryUsage = process.memoryUsage();
    const memoryInMb = Math.round(memoryUsage.rss / (1024 * 1024));
    console.log(`Memory usage: ${memoryInMb} MB`);
  }, 1000);
}
bootstrap();
