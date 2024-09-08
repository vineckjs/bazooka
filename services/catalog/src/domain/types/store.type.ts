import { Document, Types } from 'mongoose';

export interface Store extends Document {
  name: string;
  lat: number;
  lng: number;
  address: string;
  products: Types.ObjectId[];
}
