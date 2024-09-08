import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { Product } from '../types/product.type';

@Injectable()
export class ProductRepository {
  constructor(@Inject('KnexConnection') private readonly knex: Knex) {}

  async create(product: Product): Promise<Product> {
    const [createdProduct] = await this.knex('products')
      .insert({
        id: product.id,
        name: product.name,
        description: product.description,
        barcode: product.barcode,
      })
      .returning('*');

    return createdProduct;
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.knex('products').where({ id }).first();

    return product || null;
  }

  async findAll(): Promise<Product[]> {
    const products = await this.knex('products').select('*');
    return products;
  }

  async update(
    id: string,
    updateData: Partial<Product>,
  ): Promise<Product | null> {
    const [updatedProduct] = await this.knex('products')
      .where({ id })
      .update(updateData)
      .returning('*');

    return updatedProduct || null;
  }

  async delete(id: string): Promise<void> {
    await this.knex('products').where({ id }).delete();
  }
}
