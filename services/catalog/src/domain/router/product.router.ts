// products.router.ts
import { initTRPC } from '@trpc/server';
import { CatalogService } from '../services/catalog.service';
import { z } from 'zod';

const t = initTRPC.create();

export function createProductsRouter(catalogService: CatalogService) {
  return t.router({
    getProductsBySection: t.procedure
      .input(z.object({ sectionId: z.string(), merchantId: z.string() }))
      .query(async ({ input }) => {
        return catalogService.getProductsBySection(
          input.sectionId,
          input.merchantId,
        );
      }),

    updateProductPrices: t.procedure
      .input(
        z.object({
          productId: z.string(),
          price: z.number(),
          promotionalPrice: z.number().optional(),
        }),
      )
      .mutation(async ({ input }) => {
        return catalogService.updateProductPrices(
          input.productId,
          input.price,
          input.promotionalPrice,
        );
      }),

    updateProductStock: t.procedure
      .input(z.object({ productId: z.string(), availableQuantity: z.number() }))
      .mutation(async ({ input }) => {
        return catalogService.updateProductStock(
          input.productId,
          input.availableQuantity,
        );
      }),
  });
}
