Gere 3 routers trpc e os services necessários para executar a regra de negócio descrita junto com o nome de cada método para meu app nestjs:

- merchants
- sections
- products

Vou descrever abaixo os métodos que cada router deve ter:

merchants:

- getMerchants()
- getMerchant(id: string)

sections:
getSections(storeId?: string, parentId?: string): Lista as categorias de produtos, aninhadas pela propriedade "parent".

products:
getProductsBySection(context: Context, params: {sectionId: string, merchantId: string}): Lista os produtos de uma categoria com paginação por cursor para suporte ao infinite scroll.

getFeaturedProducts(context: Context, params: { merchantId: string , sectionId: string }): Lista os produtos mais populares, levando em consideração o preço médio e o número de vendas no dia.

updateProductPrices(productId:string, price: number, promotionalPrice?: number): Atualiza preços de produtos.

updateProductPricing(productId: string, pricingPolicyId: string): Atualiza a política de preços dos produtos.

updateProductStock(productId: string, availableQuantity): Atualiza o estoque de produtos.

```

Aqui vou resumir como estão configurados meus schemas mongoose:

merchant:

```

import { model, Schema, Types } from 'mongoose';
import { Merchant } from '../types/merchant.type';

export const MerchantEntity = new Schema({
name: { type: String, required: true },
stores: [{ type: Types.ObjectId, ref: 'Store' }],
});
export const MerchantModel = model<Merchant>('Merchant', MerchantEntity);

```

store-product:

```

import { model, Schema } from 'mongoose';
import { StoreProduct } from '../types/store-product.type';

export const StoreProductEntity = new Schema({
name: { type: String, required: true },
description: { type: String, required: true },
barcode: { type: String, required: true },
});

export const StoreProductModel = model<StoreProduct>(
'StoreProduct',
StoreProductEntity,
);

```

store-section:

```

import { model, Schema, Types } from 'mongoose';
import { StoreSection } from '../types/store-section.types';

export const StoreSectionEntity = new Schema({
name: { type: String, required: true },
cover: { type: String, required: false },
products: [{ type: Types.ObjectId, ref: 'StoreProduct' }],
});

export const StoreSectionModel = model<StoreSection>(
'StoreSection',
StoreSectionEntity,
);

store:

```

import { model } from 'mongoose';
import { Schema, Types } from 'mongoose';
import { Store } from '../types/store.type';

export const StoreEntity = new Schema({
name: { type: String, required: true },
lat: { type: Number, required: true },
lng: { type: Number, required: true },
address: { type: String, required: true },
products: [{ type: Types.ObjectId, ref: 'StoreProduct' }],
sections: [{ type: Types.ObjectId, ref: 'Section' }],
});
export const StoreModel = model<Store>('Store', StoreEntity);

```

Considere tambem que estou utilizando estes repositories:

merchant.repository.ts

```
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Merchant } from '../types/merchant.type';

@Injectable()
export class MerchantRepository {
  constructor(
    @InjectModel('Merchant') private readonly merchantModel: Model<Merchant>,
  ) {}

  async create(name: string, stores: Types.ObjectId[]): Promise<Merchant> {
    const newMerchant = new this.merchantModel({ name, stores });
    return newMerchant.save();
  }

  async findById(id: string): Promise<Merchant> {
    const merchant = await this.merchantModel
      .findById(id)
      .populate('stores')
      .exec();
    if (!merchant) {
      throw new NotFoundException(`Merchant with ID ${id} not found`);
    }
    return merchant;
  }

  async findAll(): Promise<Merchant[]> {
    return this.merchantModel.find().populate('stores').exec();
  }

  async update(id: string, updateData: Partial<Merchant>): Promise<Merchant> {
    const updatedMerchant = await this.merchantModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('stores')
      .exec();
    if (!updatedMerchant) {
      throw new NotFoundException(`Merchant with ID ${id} not found`);
    }
    return updatedMerchant;
  }

  async delete(id: string): Promise<void> {
    const result = await this.merchantModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Merchant with ID ${id} not found`);
    }
  }
}
```
