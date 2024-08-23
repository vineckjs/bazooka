import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schemas/product.schema';
import { Ctx, Payload, RmqContext, EventPattern } from '@nestjs/microservices';

@Injectable()
export class CatalogService implements OnModuleInit {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  onModuleInit() {
    console.log('CatalogService initialized.');
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  async findOne(id: string): Promise<Product> {
    return this.productModel.findById(id).exec();
  }

  @EventPattern('update_stock')
  async handleStockUpdate(
    @Payload() data: { productId: string; stock: number },
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    await this.productModel.findByIdAndUpdate(data.productId, {
      stock: data.stock,
    });

    channel.ack(originalMessage);
  }
}
