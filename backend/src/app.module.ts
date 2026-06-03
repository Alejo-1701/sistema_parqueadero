import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import appConfig from './config/app.config';
import { getDatabaseConfig } from './config/database.config';
import { TenantsModule } from './modules/tenants/tenants.module';
import { AccountsModule } from './modules/accounts/accounts.module';
import { RolesModule } from './modules/roles/roles.module';
import { ResidentialModule } from './modules/residential/residential.module';
import { ParkingModule } from './modules/parking/parking.module';
import { ResidentsModule } from './modules/residents/residents.module';
import { VisitorsModule } from './modules/visitors/visitors.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.get<number>('THROTTLE_TTL', 60), // segundos
          limit: configService.get<number>('THROTTLE_LIMIT', 10), // peticiones por ventana
        },
      ],
      inject: [ConfigService],
    }),
    TenantsModule,
    AccountsModule,
    RolesModule,
    ResidentialModule,
    ResidentsModule,
    VisitorsModule,
    ParkingModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule { }
