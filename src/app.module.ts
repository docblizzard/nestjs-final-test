import { AppRoutingModule } from './app.routing-module';
import { ConfigurationModule } from './infrastructure/configuration/configuration.module';
import { ConfigurationService } from './infrastructure/configuration/configuration.service';
import { DatabaseModule } from './infrastructure/database/database.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
      ConfigurationModule,
      TypeOrmModule.forRootAsync({
          imports: [ConfigurationModule],
          inject: [ConfigurationService],
          useFactory: async (configService: ConfigurationService) => configService.databaseConfig,
      }),
      AppRoutingModule,
      DatabaseModule,
  ],
})
export class AppModule {}
