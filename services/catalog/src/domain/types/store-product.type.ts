import { Document } from 'mongoose';

export interface StoreProduct extends Document {
  name: string;
  description: string;
  barcode: string;
}
