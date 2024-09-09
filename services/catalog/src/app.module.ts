import { Logger, MiddlewareConsumer, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MonitoringModule } from './infra/monitoring/monitoring.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TracingService } from './infra/tracing/tracing.service';

import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { TracingInterceptor } from './infra/tracing/tracing.interceptor';

import { createLogger } from './infra/logger/logger.config';
import { LoggerMiddleware } from './infra/logger/logger.middleware';
import { TRPCService } from './domain/services/trpc.service';
import { KnexConfigService } from './infra/database/knex.config';
import { ProductRepository } from './domain/repositories/product.repository';
import knex from 'knex';
import { CatalogService } from './domain/services/catalog.service';
import { StoreProductRepository } from './domain/repositories/store-product.repository';
import { MerchantService } from './domain/services/merchant.service';
import { MerchantRepository } from './domain/repositories/merchant.repository';
import { MerchantEntity } from './domain/entities/merchant.entity';
import { StoreEntity } from './domain/entities/store.entity';
import { StoreProductEntity } from './domain/entities/store-product.entity';
import { StoreSectionEntity } from './domain/entities/store-section.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrometheusModule.register(),
    MonitoringModule,

    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeature([
      { name: 'Merchant', schema: MerchantEntity },
      { name: 'Store', schema: StoreEntity },
      { name: 'StoreProduct', schema: StoreProductEntity },
      { name: 'StoreSection', schema: StoreSectionEntity },
    ]),

    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URI],
          queue: 'catalog_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],

  providers: [
    TRPCService,
    TracingService,
    {
      provide: 'APP_INTERCEPTOR',
      useClass: TracingInterceptor,
    },

    {
      provide: Logger,
      useFactory: (configService: ConfigService) => {
        const logger = createLogger(configService);
        return {
          log: (message: string) => logger.info(message),
          error: (message: string, trace: string) =>
            logger.error(message, trace),
          warn: (message: string) => logger.warn(message),
          debug: (message: string) => logger.debug(message),
        };
      },
      inject: [ConfigService],
    },

    KnexConfigService,
    ProductRepository,
    {
      provide: 'KnexConnection',
      useFactory: (knexConfigService: KnexConfigService) => {
        return knex(knexConfigService.getKnexConfig());
      },
      inject: [KnexConfigService],
    },
    CatalogService,
    MerchantService,
    StoreProductRepository,
    ProductRepository,
    MerchantRepository,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    consumer.apply(TRPCService.prototype.getMiddleware()).forRoutes('/trpc');
  }
}
