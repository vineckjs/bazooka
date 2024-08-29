import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as opentracing from 'opentracing';
import { TracingService } from './tracing.service';
import { tap } from 'rxjs/operators';

@Injectable()
export class TracingInterceptor implements NestInterceptor {
  constructor(private readonly tracingService: TracingService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const tracer = this.tracingService.getTracer();
    const span = tracer.startSpan('handle_request');

    const ctx = context.switchToRpc().getContext();
    if (ctx && ctx.traceContext) {
      span.setBaggageItem('trace_context', JSON.stringify(ctx.traceContext));
    }

    return next.handle().pipe(
      tap({
        next: () => span.finish(),
        error: (error) => {
          span.setTag(opentracing.Tags.ERROR, true);
          span.log({ event: 'error', message: error.message });
          span.finish();
        },
      }),
    );
  }
}
