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

  const landingPageUrl =
    process.env.LANDING_PAGE_URL || 'http://localhost:3001';
  app.enableCors({
    origin: landingPageUrl,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // Autorise les cookies/identifiants pour les requêtes cross-origin
  });

  await app.listen(3000);
}
bootstrap();
