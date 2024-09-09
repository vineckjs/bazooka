import { Document } from 'mongoose';

export interface StoreProduct extends Document {
  id?: string;
  name: string;
  thumbnail: string;
  price: number;
  promotionalPrice?: number;
  availableQuantity: number;
  description: string;
  barcode: string;
}
