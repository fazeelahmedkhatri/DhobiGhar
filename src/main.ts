/* eslint-disable @typescript-eslint/naming-convention */
import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { SerializerInterceptor } from './utils/serializer.interceptor';
import * as ngrok from 'ngrok';
import validationOptions, {
  GlobalValidationPipe,
} from './utils/validation-options';
import { useContainer } from 'class-validator';
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
  const url = await ngrok.connect({
    addr: process.env.PORT || 5000,
    authtoken: '2PZDvMvCVlMEpX49BI12LoYIWtb_7BvztLmmLVwvGBdPkDAMs',
  });
  console.log(`Ngrok tunnel opened: ${url}`);
}
void bootstrap();
