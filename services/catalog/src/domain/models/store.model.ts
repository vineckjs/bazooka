import { model, Schema, Types } from 'mongoose';
import { Store } from '../types/store.type';

export const StoreEntity = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true },
  },
  products: [{ type: Types.ObjectId, ref: 'StoreProduct' }],
  sections: [{ type: Types.ObjectId, ref: 'Section' }],
});

StoreEntity.index({ location: '2dsphere' });

export const StoreModel = model<Store>('Store', StoreEntity);
