import { Logger, MiddlewareConsumer, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CatalogModule } from './catalog/catalog.module';
import { MonitoringModule } from './monitoring/monitoring.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TracingService } from './tracing/tracing.service';

import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { TracingInterceptor } from './tracing/tracing.interceptor';

import { createLogger } from './logger.config';
import { LoggerMiddleware } from './logger.middleware';
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    PrometheusModule.register(),
    CatalogModule,
    MonitoringModule,
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
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
