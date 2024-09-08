import { Schema, Types } from 'mongoose';

export const StoreEntity = new Schema({
  name: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  address: { type: String, required: true },
  products: [{ type: Types.ObjectId, ref: 'StoreProduct' }],
  sections: [{ type: Types.ObjectId, ref: 'Section' }],
});
