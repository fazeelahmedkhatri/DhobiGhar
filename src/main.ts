/* eslint-disable @typescript-eslint/naming-convention */
import { Logger, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { SerializerInterceptor } from './utils/serializer.interceptor';
import validationOptions, {
  GlobalValidationPipe,
} from './utils/validation-options';
import { useContainer } from 'class-validator';
import { NgrokSessionBuilder } from '@ngrok/ngrok';
// eslint-disable-next-line @typescript-eslint/no-unused-vars

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  useContainer(app.select(AppModule), {
    fallbackOnErrors: true,
    fallback: true,
  });
  const configService = app.get(ConfigService);
  app.enableShutdownHooks();
  app.setGlobalPrefix(configService.get('app.apiPrefix'), {
    exclude: ['/'],
  });
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalInterceptors(new SerializerInterceptor());
  app.useGlobalPipes(new GlobalValidationPipe(validationOptions));

  const options = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API docs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  await app.listen(configService.get('app.port'));

  // Setup ngrok ingress
  const session = await new NgrokSessionBuilder().authtokenFromEnv().connect();
  const tunnel = await session.httpEndpoint().listen();
  new Logger('main').log(`Ingress established at ${tunnel.url()}`);
  tunnel.forwardTcp(`localhost:${configService.get('app.port')}`);
}
void bootstrap();
