import { Controller, Get, Param } from '@nestjs/common';
import { MerchantService } from '../services/merchant.service';
import { IsString } from 'class-validator';

class GetMerchantDto {
  @IsString()
  id: string;
}

@Controller('merchants')
export class MerchantsController {
  constructor(private readonly merchantService: MerchantService) {}

  @Get()
  async getAllMerchants() {
    return this.merchantService.getAllMerchants();
  }

  @Get(':id')
  async getMerchant(@Param() params: GetMerchantDto) {
    const { id } = params;
    return this.merchantService.getMerchantById(id);
  }
}
