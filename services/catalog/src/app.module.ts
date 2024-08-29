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
import { TRPCService } from './app/services/trpc.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    PrometheusModule.register(),
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
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    consumer.apply(TRPCService.prototype.getMiddleware()).forRoutes('*');
  }
}
