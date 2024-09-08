import { model } from 'mongoose';
import { StoreProduct } from '../types/store-product.type';
import { StoreProductEntity } from '../entities/store-product.entity';

export const StoreProductModel = model<StoreProduct>(
  'StoreProduct',
  StoreProductEntity,
);
