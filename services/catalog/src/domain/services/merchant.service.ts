import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Merchant } from '../types/merchant.type';
import { Model } from 'mongoose';

@Injectable()
export class MerchantService {
  constructor(
    @InjectModel('Merchant') private readonly merchantModel: Model<Merchant>,
  ) {}

  async getAllMerchants() {
    return this.merchantModel.find();
  }

  async getMerchantById(id: string) {
    return this.merchantModel.findById(id);
  }
}
