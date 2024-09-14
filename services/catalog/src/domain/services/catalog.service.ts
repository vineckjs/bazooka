import { Injectable } from '@nestjs/common';
import { LocationService } from './location.service';
import { InjectModel } from '@nestjs/mongoose';

interface Context {
  lat: number;
  lng: number;
}

interface ListingParams {
  cursor?: string;
  limit?: number;
  merchantId?: string;
  sectionId?: string;
}

@Injectable()
export class CatalogService {
  constructor(
    private readonly locationService: LocationService,

    @InjectModel('StoreProduct')
    private readonly storeProductModel,
  ) {}

  async getProductsBySection(context: Context, params: ListingParams) {
    const { lat, lng } = context;
    const { sectionId, merchantId, cursor, limit = 20 } = params;

    // Obtém as lojas dentro do raio de 10km do centro da localização do usuário
    const nearbyStores = await this.locationService.getStoresInRadius({
      lat,
      lng,
    });

    // Consulta os produtos na seção especificada, nas lojas próximas
    const query = this.storeProductModel
      .find({
        section: sectionId,
        merchant: merchantId,
        store: { $in: nearbyStores.map((store) => store.id) },
      })
      .limit(limit)
      .sort({ id: 1 });

    if (cursor) {
      query.where('id').gt(cursor);
    }

    const products = await query.lean();

    return {
      products,
      nextCursor: products.length === limit ? products[limit - 1].id : null,
    };
  }

  async getFeaturedProducts(context: Context, params: ListingParams) {
    const { lat, lng } = context;
    const { cursor, limit = 20 } = params;

    // Obtém as lojas dentro do raio de 10km do centro da localização do usuário
    const nearbyStores = await this.locationService.getStoresInRadius({
      lat,
      lng,
    });

    // Consulta produtos com promotionalPrice e calcula a diferença de preço
    const products = await this.storeProductModel.aggregate([
      {
        $match: {
          promotionalPrice: { $exists: true, $ne: null },
          store: { $in: nearbyStores.map((store) => store.id) },
        },
      },
      {
        $lookup: {
          from: 'storeproducts',
          localField: 'id',
          foreignField: 'productId',
          as: 'storeData',
        },
      },
      {
        $addFields: {
          averagePrice: {
            $let: {
              vars: {
                prices: {
                  $map: {
                    input: '$storeData',
                    as: 'data',
                    in: '$$data.price',
                  },
                },
              },
              in: { $avg: '$$prices' },
            },
          },
          priceDifference: {
            $subtract: ['$averagePrice', '$promotionalPrice'],
          },
        },
      },
      { $sort: { priceDifference: 1, salesDay: -1 } },
      { $limit: limit },
    ]);

    // Aplicação de cursor
    const filteredProducts = cursor
      ? products.filter((product) => product.id > cursor)
      : products;

    return {
      products: filteredProducts,
      nextCursor:
        filteredProducts.length === limit
          ? filteredProducts[filteredProducts.length - 1].id
          : null,
    };
  }
  async updateProductPrices(
    productId: string,
    price: number,
    promotionalPrice?: number,
  ) {
    return this.storeProductModel.update(productId, {
      price,
      promotionalPrice,
    });
  }

  async updateProductStock(productId: string, availableQuantity: number) {
    return this.storeProductModel.update(productId, {
      availableQuantity,
    });
  }
}
