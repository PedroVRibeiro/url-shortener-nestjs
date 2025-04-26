import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { UnauthorizedExceptionFilter } from './common/filters/unauthorized-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppDataSource } from './config/database/datasource';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  await AppDataSource.initialize();
  await AppDataSource.runMigrations();

  app.useGlobalFilters(new UnauthorizedExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('URL Shortener - NestJS')
    .setDescription('An API for shortening URLs')
    .setVersion('0.2.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'jwt',
    )
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory);

  const appPort =
    process.env.PORT || configService.get<number>('APP_PORT') || 3000;
  const pgAdminPort = configService.get<number>('PGADMIN_PORT') || 5050;

  await app.listen(appPort);

  console.clear();

  const banner = `
============================================================
🚀 App running:      http://localhost:${appPort}
📚 Swagger Docs:     http://localhost:${appPort}/swagger
🛢️  PgAdmin Panel:    http://localhost:${pgAdminPort}
============================================================
  `;

  console.log(banner);
}
void bootstrap();
