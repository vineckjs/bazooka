import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as client from 'prom-client';

@Injectable()
export class PrometheusService implements NestMiddleware {
  private readonly registry: client.Registry;

  constructor() {
    this.registry = new client.Registry();

    const defaultGauge = new client.Gauge({
      name: 'nodejs_gauge',
      help: 'Gauge for demonstration purposes',
    });
    this.registry.registerMetric(defaultGauge);
  }

  use(req: Request, res: Response, next: NextFunction) {
    if (req.path === '/metrics') {
      res.set('Content-Type', this.registry.contentType);
      res.end(this.registry.metrics());
    } else {
      next();
    }
  }
}
