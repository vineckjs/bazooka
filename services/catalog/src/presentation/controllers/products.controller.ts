// src/controllers/products.controller.ts
import { Controller, Get, Patch, Query, Body } from '@nestjs/common';
import { CatalogService } from '../../application/services/catalog.service';
import { IsNumber, IsOptional, IsString } from 'class-validator';

class GetProductsBySectionDto {
  @IsString()
  sectionId: string;

  @IsString()
  merchantId: string;

  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;

  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @IsNumber()
  limit?: number;
}

class GetFeaturedProductsDto {
  @IsOptional()
  @IsString()
  sectionId?: string;

  @IsOptional()
  @IsString()
  merchantId?: string;

  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;

  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @IsNumber()
  limit?: number;
}

class UpdateProductPricesDto {
  @IsString()
  productId: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  promotionalPrice?: number;
}

class UpdateProductStockDto {
  @IsString()
  productId: string;

  @IsNumber()
  availableQuantity: number;
}

@Controller('products')
export class ProductsController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('by-section')
  async getProductsBySection(@Query() query: GetProductsBySectionDto) {
    const { lat, lng, cursor, limit } = query;
    return this.catalogService.getProductsBySection(
      { lat, lng },
      { cursor, limit },
    );
  }

  @Get('featured')
  async getFeaturedProducts(@Query() query: GetFeaturedProductsDto) {
    const { lat, lng, cursor, limit, sectionId, merchantId } = query;

    return this.catalogService.getFeaturedProducts(
      { lat, lng },
      { cursor, limit, sectionId, merchantId },
    );
  }

  @Patch('prices')
  async updateProductPrices(@Body() body: UpdateProductPricesDto) {
    const { productId, price, promotionalPrice } = body;
    return this.catalogService.updateProductPrices(
      productId,
      price,
      promotionalPrice,
    );
  }

  @Patch('stock')
  async updateProductStock(@Body() body: UpdateProductStockDto) {
    const { productId, availableQuantity } = body;
    return this.catalogService.updateProductStock(productId, availableQuantity);
  }
}
