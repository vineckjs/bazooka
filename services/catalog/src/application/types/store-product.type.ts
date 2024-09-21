import { Document, Types } from 'mongoose';

export interface StoreProduct extends Document {
  id: Types.ObjectId;
  name: string;
  thumbnail: string;
  price: number;
  promotionalPrice?: number;
  availableQuantity: number;
  description: string;
  barcode: string;
}
