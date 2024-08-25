import { initTRPC } from '@trpc/server';

const t = initTRPC.create();

export const AppRouter = t.router({
  hello: t.procedure.query(() => {
    return 'Hello World!';
  }),
});

export type AppRouterType = typeof AppRouter;
