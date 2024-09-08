import { model } from 'mongoose';
import { Store, StoreEntity } from '../entities/store.entity';

export const StoreModel = model<Store>('Store', StoreEntity);
