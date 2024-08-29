import { Customer } from './customer';
import { Product } from './product';

export interface CatalogMerchantSchema {
  getFeatureds(context: Customer): Product[];
}
