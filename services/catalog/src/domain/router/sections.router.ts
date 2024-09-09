// sections.router.ts
import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { SectionService } from '../services/sections.service';

const t = initTRPC.create();

export const sectionsRouter = t.router({
  getSections: t.procedure
    .input(
      z.object({
        storeId: z.string().optional(),
        parentId: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      const sectionService = new SectionService();
      return sectionService.getSections(input.storeId, input.parentId);
    }),
});
