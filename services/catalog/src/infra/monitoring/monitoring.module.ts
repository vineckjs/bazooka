import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { PrometheusService } from './prometheus.service';

@Module({
  providers: [PrometheusService],
})
export class MonitoringModule implements NestModule {
  constructor(private readonly prometheusService: PrometheusService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(this.prometheusService.use.bind(this.prometheusService))
      .forRoutes('/metrics');
  }
}
