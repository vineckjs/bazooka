import { initTRPC } from '@trpc/server';
import customerRoutes from './routes/customer.routes';
import merchantRoutes from './routes/merchant.routes';

const t = initTRPC.create();

export const AppRouter = t.router({
  ...customerRoutes,
  ...merchantRoutes,
});

export type AppRouterType = typeof AppRouter;
