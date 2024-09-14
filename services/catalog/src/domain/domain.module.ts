import { Module } from '@nestjs/common';
import { CatalogService } from './services/catalog.service';
import { MerchantService } from './services/merchant.service';
import { StoreProductRepository } from './repositories/store-product.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { StoreProductEntity } from './entities/store-product.entity';
import { MerchantEntity } from './entities/merchant.entity';
import { StoreSectionEntity } from './entities/store-section.entity';
import { StoreEntity } from './entities/store.entity';
import { LocationService } from './services/location.service';
import { ProductsController } from './controllers/products.controller';
import { SectionsController } from './controllers/sections.controller';
import { MerchantsController } from './controllers/merchants.controller';
import { SectionService } from './services/sections.service';

@Module({
  controllers: [ProductsController, MerchantsController, SectionsController],
  imports: [
    MongooseModule.forFeature([
      { name: 'Merchant', schema: MerchantEntity },
      { name: 'Store', schema: StoreEntity },
      { name: 'StoreProduct', schema: StoreProductEntity },
      { name: 'StoreSection', schema: StoreSectionEntity },
    ]),
  ],
  providers: [
    LocationService,
    CatalogService,
    SectionService,
    MerchantService,
    StoreProductRepository,
  ],
  exports: [CatalogService, MerchantService, SectionService], // Exporte o que for necessário em outros módulos
})
export class DomainModule {}
