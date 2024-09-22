import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Types } from 'mongoose';
import { faker } from '@faker-js/faker';
import { Merchant } from 'src/application/types/merchant.type';
import { Store } from 'src/application/types/store.type';
import { StoreProduct } from 'src/application/types/store-product.type';
import { StoreSection } from 'src/application/types/store-section.types';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel('Merchant')
    private readonly merchantModel: Model<Merchant>,
    @InjectModel('Store') private readonly storeModel: Model<Store>,
    @InjectModel('StoreProduct')
    private readonly storeProductModel: Model<StoreProduct>,
    @InjectModel('StoreSection')
    private readonly storeSectionModel: Model<StoreSection>,
  ) {}

  private getRandomCoordinates() {
    const curitibaLat = -25.4372;
    const curitibaLng = -49.2699;
    const radius = 0.27;
    const lat = curitibaLat + (Math.random() - 0.5) * radius;
    const lng = curitibaLng + (Math.random() - 0.5) * radius;
    return { lat, lng };
  }

  private async generateSections() {
    const sectionNames = [
      'Hortifruti',
      'Padaria',
      'Açougue',
      'Bebidas',
      'Laticínios',
      'Higiene Pessoal',
      'Limpeza',
      'Congelados',
      'Doces',
      'Mercearia',
    ];

    const sections = [];
    for (const sectionName of sectionNames) {
      const section = new this.storeSectionModel({
        name: sectionName,
        cover: faker.image.url(),
      });
      await section.save();
      sections.push(section);
    }

    return sections;
  }

  private async generateProducts(
    storeId: Types.ObjectId,
    sectionId: Types.ObjectId,
  ) {
    for (let i = 0; i < 10; i++) {
      const product = new this.storeProductModel({
        id: new Types.ObjectId(),
        name: faker.commerce.productName(),
        thumbnail: faker.image.url(),
        price: parseFloat(faker.commerce.price({ min: 5, max: 200 })),
        promotionalPrice:
          Math.random() > 0.5
            ? parseFloat(faker.commerce.price({ min: 5, max: 150 }))
            : undefined,
        availableQuantity: faker.number.int({ min: 1, max: 100 }),

        description: faker.commerce.productDescription(),
        barcode: faker.string.uuid(),
        sectionId,
      });
      await product.save();
      await this.storeModel.findByIdAndUpdate(storeId, {
        $push: { products: product.id },
      });
    }
  }

  private async generateStore(
    merchantId: Types.ObjectId,
    sections: StoreSection[],
  ) {
    const { lat, lng } = this.getRandomCoordinates();

    const store = new this.storeModel({
      name: faker.company.name(),
      location: {
        type: 'Point',
        coordinates: [lng, lat],
      },
      address: faker.address.streetAddress(),
      products: [],
      sections: sections.map((section) => section.id),
      merchantId,
    });
    await store.save();

    for (const section of sections) {
      await this.generateProducts(store.id, section.id);
    }

    return store;
  }

  private async generateMerchants() {
    const sections = await this.generateSections();

    for (let i = 0; i < 5; i++) {
      const merchant = new this.merchantModel({
        name: faker.company.name(),
        stores: [],
      });

      for (let j = 0; j < 4; j++) {
        const store = await this.generateStore(merchant.id, sections);
        await this.merchantModel.findByIdAndUpdate(merchant.id, {
          $push: { stores: store.id },
        });
      }

      await merchant.save();
    }
  }

  // Função principal para iniciar o seed
  async generateData() {
    await this.generateMerchants();
    console.log('Seed data successfully generated!');
  }
}
