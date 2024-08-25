import { Injectable } from '@nestjs/common';
import * as trpcExpress from '@trpc/server/adapters/express';
import { AppRouter } from './trpc.router';

@Injectable()
export class TRPCService {
  private appRouter = AppRouter;

  getMiddleware() {
    return trpcExpress.createExpressMiddleware({
      router: this.appRouter,
      createContext: () => ({}),
    });
  }

  getAppRouter() {
    return this.appRouter;
  }
}
