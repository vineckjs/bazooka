import { Document, Types } from 'mongoose';

export interface Merchant extends Document {
  name: string;
  stores: Types.ObjectId[];
}
