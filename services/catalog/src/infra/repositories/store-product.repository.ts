import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StoreProduct } from '../../application/types/store-product.type';

@Injectable()
export class StoreProductRepository {
  constructor(
    @InjectModel('StoreProduct')
    private readonly storeProductModel: Model<StoreProduct>,
  ) {}

  async create(product: StoreProduct): Promise<StoreProduct> {
    const newProduct = new this.storeProductModel(product);
    return newProduct.save();
  }

  async findById(productId: string): Promise<StoreProduct | null> {
    return this.storeProductModel.findById(productId).exec();
  }

  async findAll(): Promise<StoreProduct[]> {
    return this.storeProductModel.find().exec();
  }

  async find(params: object): Promise<StoreProduct[]> {
    return this.storeProductModel.find(params).exec();
  }

  async update(
    productId: string,
    updateData: Partial<StoreProduct>,
  ): Promise<StoreProduct | null> {
    return this.storeProductModel
      .findByIdAndUpdate(productId, updateData, { new: true })
      .exec();
  }

  async delete(productId: string): Promise<void> {
    await this.storeProductModel.findByIdAndDelete(productId).exec();
  }
}
