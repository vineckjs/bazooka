// section.service.ts
import { Injectable } from '@nestjs/common';
import { StoreSectionModel } from '../models/store-section.model';

@Injectable()
export class SectionService {
  async getSections(storeId?: string, parentId?: string) {
    const query: any = {};
    if (storeId) {
      query.store = storeId;
    }
    if (parentId) {
      query.parent = parentId;
    }

    return StoreSectionModel.find(query).populate('products').lean();
  }
}
