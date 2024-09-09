// merchants.router.ts
import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { MerchantService } from '../services/merchant.service';

const t = initTRPC.create();

export function createMerchantsRouter(merchantService: MerchantService) {
  return t.router({
    getMerchants: t.procedure.query(async () => {
      return merchantService.getAllMerchants();
    }),

    getMerchant: t.procedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return merchantService.getMerchantById(input.id);
      }),
  });
}
