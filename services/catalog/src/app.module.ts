import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MonitoringModule } from './infra/monitoring/monitoring.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { DatabaseModule } from './infra/database/database.module';
import { DomainModule } from './domain/domain.module';
import { TRPCService } from './domain/services/trpc.service';
import { LoggerMiddleware } from './infra/logger/logger.middleware';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    PrometheusModule.register(),
    MonitoringModule,
    DatabaseModule,
    DomainModule,
  ],
  providers: [TRPCService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    consumer.apply(TRPCService.prototype.getMiddleware()).forRoutes('/trpc');
  }
}
