import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Middleware to capture raw body for Stripe webhook signature verification
  app.use(
    bodyParser.json({
      verify: (req: any, res, buf) => {
        req.rawBody = buf;
      },
    }),
  );

  await app.listen(3000);
}
bootstrap();
