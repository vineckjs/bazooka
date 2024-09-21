import { model } from 'mongoose';
import { StoreSectionEntity } from '../entities/store-section.entity';
import { StoreSection } from '../../application/types/store-section.types';

export const StoreSectionModel = model<StoreSection>(
  'StoreSection',
  StoreSectionEntity,
);
