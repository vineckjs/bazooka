import { Module } from '@nestjs/common';
import { CatalogService } from './services/catalog.service';
import { MerchantService } from './services/merchant.service';
import { ProductRepository } from './repositories/product.repository';
import { StoreProductRepository } from './repositories/store-product.repository';
import { MerchantRepository } from './repositories/merchant.repository';
import { DatabaseModule } from 'src/infra/database/database.module';
import { MongooseModule } from '@nestjs/mongoose';
import { StoreProductEntity } from './entities/store-product.entity';
import { MerchantEntity } from './entities/merchant.entity';
import { StoreSectionEntity } from './entities/store-section.entity';
import { StoreEntity } from './entities/store.entity';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([
      { name: 'Merchant', schema: MerchantEntity },
      { name: 'Store', schema: StoreEntity },
      { name: 'StoreProduct', schema: StoreProductEntity },
      { name: 'StoreSection', schema: StoreSectionEntity },
    ]),
  ],
  providers: [
    CatalogService,
    MerchantService,
    ProductRepository,
    StoreProductRepository,
    MerchantRepository,
  ],
  exports: [CatalogService, MerchantService], // Exporte o que for necessário em outros módulos
})
export class DomainModule {}
