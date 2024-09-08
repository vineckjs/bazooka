import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Merchant } from '../types/merchant.type';

@Injectable()
export class MerchantRepository {
  constructor(
    @InjectModel('Merchant') private readonly merchantModel: Model<Merchant>,
  ) {}

  async create(name: string, stores: Types.ObjectId[]): Promise<Merchant> {
    const newMerchant = new this.merchantModel({ name, stores });
    return newMerchant.save();
  }

  async findById(id: string): Promise<Merchant> {
    const merchant = await this.merchantModel
      .findById(id)
      .populate('stores')
      .exec();
    if (!merchant) {
      throw new NotFoundException(`Merchant with ID ${id} not found`);
    }
    return merchant;
  }

  async findAll(): Promise<Merchant[]> {
    return this.merchantModel.find().populate('stores').exec();
  }

  async update(id: string, updateData: Partial<Merchant>): Promise<Merchant> {
    const updatedMerchant = await this.merchantModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('stores')
      .exec();
    if (!updatedMerchant) {
      throw new NotFoundException(`Merchant with ID ${id} not found`);
    }
    return updatedMerchant;
  }

  async delete(id: string): Promise<void> {
    const result = await this.merchantModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Merchant with ID ${id} not found`);
    }
  }
}
