import { initTRPC } from '@trpc/server';
import { CatalogService } from '../services/catalog.service';
import { z } from 'zod';

const t = initTRPC.create();

export function createProductsRouter(catalogService: CatalogService) {
  return t.router({
    getProductsBySection: t.procedure
      .input(
        z.object({
          sectionId: z.string(),
          merchantId: z.string(),
          lat: z.number(),
          lng: z.number(),
          cursor: z.string().optional(),
          limit: z.number().optional(),
        }),
      )
      .query(async ({ input }) => {
        return catalogService.getProductsBySection(
          { lat: input.lat, lng: input.lng },
          { cursor: input.cursor, limit: input.limit },
        );
      }),

    getFeaturedProducts: t.procedure
      .input(
        z.object({
          sectionId: z.string(),
          merchantId: z.string(),
          lat: z.number(),
          lng: z.number(),
          cursor: z.string().optional(),
          limit: z.number().optional(),
        }),
      )
      .query(async ({ input }) => {
        return catalogService.getFeaturedProducts(
          { lat: input.lat, lng: input.lng },
          {
            cursor: input.cursor,
            limit: input.limit,
            sectionId: input.sectionId,
            merchantId: input.merchantId,
          },
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
