import { model } from 'mongoose';
import { StoreEntity } from '../entities/store.entity';
import { Store } from '../types/store.type';

export const StoreModel = model<Store>('Store', StoreEntity);
