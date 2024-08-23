import { Controller } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { t } from '@trpc/server';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  // Defina os endpoints para tRPC
  create = t.procedure.input(CreateProductDto).mutation(({ input }) => {
    return this.catalogService.create(input);
  });

  findAll = t.procedure.query(() => {
    return this.catalogService.findAll();
  });

  findOne = t.procedure.input(z.string()).query(({ input }) => {
    return this.catalogService.findOne(input);
  });

  update = t.procedure.input(UpdateProductDto).mutation(({ input }) => {
    return this.catalogService.update(input.id, input);
  });

  remove = t.procedure.input(z.string()).mutation(({ input }) => {
    return this.catalogService.remove(input);
  });
}
