import { model } from 'mongoose';
import { Store } from '../../application/types/store.type';
import { StoreEntity } from '../entities/store.entity';

export const StoreModel = model<Store>('Store', StoreEntity);
