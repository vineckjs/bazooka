import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { KnexConfigService } from './knex.config';
import { ConfigModule } from '@nestjs/config';
import knex from 'knex';
import { MerchantEntity } from 'src/domain/entities/merchant.entity';
import { StoreEntity } from 'src/domain/entities/store.entity';
import { StoreProductEntity } from 'src/domain/entities/store-product.entity';
import { StoreSectionEntity } from 'src/domain/entities/store-section.entity';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeature([
      { name: 'Merchant', schema: MerchantEntity },
      { name: 'Store', schema: StoreEntity },
      { name: 'StoreProduct', schema: StoreProductEntity },
      { name: 'StoreSection', schema: StoreSectionEntity },
    ]),
  ],
  providers: [
    KnexConfigService,
    {
      provide: 'KnexConnection',
      useFactory: (knexConfigService: KnexConfigService) => {
        return knex(knexConfigService.getKnexConfig());
      },
      inject: [KnexConfigService],
    },
  ],
  exports: ['KnexConnection'],
})
export class DatabaseModule {}
