import { Document, Types } from 'mongoose';

export interface StoreSection extends Document {
  name: string;
  cover: string;
  products: Types.ObjectId[];
}
