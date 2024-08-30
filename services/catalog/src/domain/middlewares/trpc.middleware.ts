import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppRouter } from '../app.router';
import * as trpcExpress from '@trpc/server/adapters/express';

@Module({
  imports: [],
  providers: [],
})
export class TrpcModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        trpcExpress.createExpressMiddleware({
          router: AppRouter,
        }),
      )
      .forRoutes('/trpc');
  }
}
