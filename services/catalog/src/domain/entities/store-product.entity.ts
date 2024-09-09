import { Schema } from 'mongoose';

export const StoreProductEntity = new Schema({
  name: { type: String, required: true },
  thumbnail: { type: String, required: true },
  price: { type: Number, required: true },
  promotionalPrice: { type: Number, required: false },
  availableQuantity: { type: Number, required: true },
  description: { type: String, required: true },
  barcode: { type: String, required: true },
});
