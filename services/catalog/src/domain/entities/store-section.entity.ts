import { Schema, Types } from 'mongoose';

export const StoreSectionEntity = new Schema({
  name: { type: String, required: true },
  cover: { type: String, required: false },
  products: [{ type: Types.ObjectId, ref: 'StoreProduct' }],
});
