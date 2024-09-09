import { Injectable } from '@nestjs/common';
import { MerchantRepository } from '../repositories/merchant.repository';

@Injectable()
export class MerchantService {
  constructor(private readonly merchantRepository: MerchantRepository) {}

  async getAllMerchants() {
    return this.merchantRepository.findAll();
  }

  async getMerchantById(id: string) {
    return this.merchantRepository.findById(id);
  }
}
