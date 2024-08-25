import {
  Injectable,
  OnModuleDestroy,
  MiddlewareConsumer,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import * as jaeger from 'jaeger-client';
import * as opentracing from 'opentracing';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TracingService implements NestModule, OnModuleDestroy {
  private tracer: opentracing.Tracer;
  private reporter: jaeger.Reporter;

  constructor() {
    this.reporter = jaeger.initTracer(
      {
        serviceName: 'catalog-service',
        reporter: {
          agentHost: 'jaeger-agent',
          agentPort: 5775,
        },
        sampler: {
          type: 'const',
          param: 1,
        },
      },
      {
        logger: {
          info: (msg) => console.log('INFO: ' + msg),
          error: (msg) => console.error('ERROR: ' + msg),
        },
      },
    ).reporter;

    this.tracer = jaeger.initTracer(
      {
        serviceName: 'catalog-service',
        reporter: this.reporter,
        sampler: {
          type: 'const',
          param: 1,
        },
      },
      {
        logger: {
          info: (msg) => console.log('INFO: ' + msg),
          error: (msg) => console.error('ERROR: ' + msg),
        },
      },
    );
  }

  getTracer() {
    return this.tracer;
  }

  onModuleDestroy() {
    // No need to explicitly call close on tracer
    this.reporter.flush();
  }

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(this.tracingMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }

  private tracingMiddleware(req: Request, res: Response, next: NextFunction) {
    const span = this.tracer.startSpan(`HTTP ${req.method} ${req.originalUrl}`);
    res.on('finish', () => {
      span.setTag(opentracing.Tags.HTTP_STATUS_CODE, res.statusCode);
      span.finish();
    });
    next();
  }
}
