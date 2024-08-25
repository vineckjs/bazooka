import { Controller, Logger } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { t } from '@trpc/server';
import z from 'zod';

@Controller('catalog')
export class CatalogController {
  private readonly logger = new Logger(CatalogController.name);

  constructor(private readonly catalogService: CatalogService) {
    this.logger.log('starting catalog controller...');
  }

  findAll = t.procedure.query(() => {
    return this.catalogService.findAll();
  });

  findOne = t.procedure.input(z.string()).query(({ input }) => {
    return this.catalogService.findOne(input);
  });
}
