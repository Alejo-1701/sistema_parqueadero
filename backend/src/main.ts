import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Global prefix
  const apiPrefix = configService.get<string>('API_PREFIX', 'api/v1');
  app.setGlobalPrefix(apiPrefix);

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Sistema de Parqueaderos')
    .setDescription('API para la gestión y control del sistema de parqueaderos')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingrese el token JWT obtenido del login',
        in: 'header',
      },
      'bearer', // Nombre que busca @ApiBearerAuth() por defecto
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document);

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global interceptors
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Global guards are now provided via APP_GUARD in AppModule

  // CORS configuration
  app.enableCors({
    origin: configService.get('cors.origins'),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: configService.get('cors.credentials', false),
  });

  // Start server
  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);

  console.log(
    `Aplicación ejecutándose en: http://localhost:${port}/${apiPrefix}`,
  );
  console.log(
    `Documentación Swagger en:  http://localhost:${port}/${apiPrefix}/docs`,
  );
  console.log(
    `Entorno: ${configService.get<string>('NODE_ENV', 'development')}`,
  );
}

bootstrap();
