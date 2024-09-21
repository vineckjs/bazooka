import { model } from 'mongoose';
import { StoreProduct } from '../../application/types/store-product.type';
import { StoreProductEntity } from '../entities/store-product.entity';

export const StoreProductModel = model<StoreProduct>(
  'StoreProduct',
  StoreProductEntity,
);
