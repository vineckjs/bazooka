import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CatalogService } from './application/services/catalog.service';
import { MerchantService } from './application/services/merchant.service';
import { StoreProductRepository } from './infra/repositories/store-product.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { StoreProductEntity } from './domain/entities/store-product.entity';
import { MerchantEntity } from './domain/entities/merchant.entity';
import { StoreSectionEntity } from './domain/entities/store-section.entity';
import { StoreEntity } from './domain/entities/store.entity';
import { LocationService } from './application/services/location.service';
import { ProductsController } from './presentation/controllers/products.controller';
import { SectionsController } from './presentation/controllers/sections.controller';
import { MerchantsController } from './presentation/controllers/merchants.controller';
import { SectionService } from './application/services/sections.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SeedService } from './infra/database/seed/seed.service';
import { LoggerMiddleware } from './infra/logger/logger.middleware';

@Module({
  controllers: [ProductsController, MerchantsController, SectionsController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // PrometheusModule.register(),
    // MonitoringModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
        autoIndex: true,
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: 'Merchant', schema: MerchantEntity },
      { name: 'Store', schema: StoreEntity },
      { name: 'StoreProduct', schema: StoreProductEntity },
      { name: 'StoreSection', schema: StoreSectionEntity },
    ]),
  ],
  providers: [
    SeedService,
    LocationService,
    CatalogService,
    SectionService,
    MerchantService,
    StoreProductRepository,
  ],
  exports: [SeedService, CatalogService, MerchantService, SectionService], // Exporte o que for necessário em outros módulos
})
export class AppModule {
  constructor() {}
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
