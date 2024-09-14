import { Module } from '@nestjs/common';
import { KnexConfigService } from './knex.config';
import { ConfigModule } from '@nestjs/config';
import knex from 'knex';

@Module({
  imports: [ConfigModule],
  providers: [
    KnexConfigService,
    {
      provide: 'KnexConnection',
      useFactory: (knexConfigService: KnexConfigService) => {
        return knex(knexConfigService.getKnexConfig());
      },
      inject: [KnexConfigService],
    },
  ],
  exports: ['KnexConnection'],
})
export class DatabaseModule {}
