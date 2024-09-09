import { Injectable } from '@nestjs/common';
import { StoreProductRepository } from '../repositories/store-product.repository';

@Injectable()
export class CatalogService {
  constructor(
    private readonly storeProductRepository: StoreProductRepository,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getProductsBySection(sectionId: string, merchantId: string) {
    return this.storeProductRepository
      .findAll
      //   {
      //     section: sectionId,
      //     merchantId,
      //   }
      ();
  }

  async updateProductPrices(
    productId: string,
    price: number,
    promotionalPrice?: number,
  ) {
    return this.storeProductRepository.update(productId, {
      price,
      promotionalPrice,
    });
  }

  async updateProductStock(productId: string, availableQuantity: number) {
    return this.storeProductRepository.update(productId, {
      availableQuantity,
    });
  }
}
