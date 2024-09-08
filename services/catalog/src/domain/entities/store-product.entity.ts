import { Schema } from 'mongoose';

export const StoreProductEntity = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  barcode: { type: String, required: true },
});
