import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CatalogService } from './catalog.service';
import { CatalogController } from './catalog.controller';
import { Product, ProductSchema } from './catalog.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  controllers: [CatalogController],
  providers: [CatalogService],
})
export class CatalogModule {}
