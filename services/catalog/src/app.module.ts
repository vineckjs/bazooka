import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { CatalogModule } from './catalog/catalog.module';
import { MonitoringModule } from './monitoring/monitoring.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TracingService } from './tracing/tracing.service';

import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { TracingInterceptor } from './tracing/tracing.interceptor';

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
  ],
})
export class AppModule {}
