import { Schema, Types } from 'mongoose';

export const MerchantEntity = new Schema({
  name: { type: String, required: true },
  stores: [{ type: Types.ObjectId, ref: 'Store' }],
});
