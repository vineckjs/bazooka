// section.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StoreSection } from '../types/store-section.types';

@Injectable()
export class SectionService {
  constructor(
    @InjectModel('StoreSection')
    private readonly storeSectionModel: Model<StoreSection>,
  ) {}

  async getSections(storeId?: string, parentId?: string) {
    const query: any = {};
    if (storeId) {
      query.store = storeId;
    }
    if (parentId) {
      query.parent = parentId;
    }

    return this.storeSectionModel.find(query).populate('products').lean();
  }
}
