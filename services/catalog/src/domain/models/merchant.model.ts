import { model } from 'mongoose';
import { MerchantEntity } from '../entities/merchant.entity';
import { Merchant } from '../../application/types/merchant.type';

export const MerchantModel = model<Merchant>('Merchant', MerchantEntity);
