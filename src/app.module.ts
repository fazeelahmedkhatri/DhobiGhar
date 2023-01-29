import {
  CacheModule,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { UserModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import appConfig from './config/app.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { RoleModule } from './modules/roles/role.module';
import databaseConfig from './config/database.config';
import { DataSource } from 'typeorm';
import { AuthService } from './modules/auth/auth.service';
import { MailService } from './helpers/EmailHelper';
import { JwtService } from '@nestjs/jwt';
import { JwtHelperService } from './helpers/jwt-helper.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RoutesModule } from './modules/routes/routes.module';
import { CacheConfigService } from './cache/cache-config.service';
import cacheConfig from './config/cache.config';
import { AppLoggerMiddleware } from './middlewares/logging.middleware';
import { BusinessModule } from './modules/business/business.module';
import { RidersModule } from './modules/riders/riders.module';
import { ConsumersModule } from './modules/consumers/consumers.module';
import { ProductsModule } from './modules/products/products.module';
import { ServicesModule } from './modules/services/services.module';
import { OrdersModule } from './modules/orders/orders.module';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useClass: CacheConfigService,
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, cacheConfig, appConfig],
      envFilePath: ['.env.example'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options) => {
        const data_source = await new DataSource(options).initialize();
        return data_source;
      },
    }),
    UserModule,
    RoleModule,
    AuthModule,
    RoutesModule,
    BusinessModule,
    RidersModule,
    ConsumersModule,
    ProductsModule,
    ServicesModule,
    OrdersModule,
  ],
  providers: [
    AuthService,
    MailService,
    JwtService,
    JwtHelperService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
