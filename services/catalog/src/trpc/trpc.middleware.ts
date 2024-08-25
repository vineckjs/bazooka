import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppRouter } from './trpc.router';
import { CatalogModule } from 'src/catalog/catalog.module';
import { CatalogService } from 'src/catalog/catalog.service';
import * as trpcExpress from '@trpc/server/adapters/express';

@Module({
  imports: [CatalogModule],
  providers: [CatalogService],
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
