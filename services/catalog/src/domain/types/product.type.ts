export interface Product {
  id: string;
  barcode: string;
  thumbnail: string;
  name: string;
  description: string;
  full_description: string;
  brand_name: string;
  net_weight: number;
  gross_weight: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  avg_price: number;
}
