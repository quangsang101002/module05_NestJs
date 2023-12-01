import { Product } from '../entities/product.entity';

export class ProductResponse {
  id: number;
  sku: string;
  name_product: string;
  category: number;
  unit_price: number;
  description: string;
  avatar: string;
  gallery: string;

  constructor(product: Product) {
    this.id = product.id;
    this.sku = product.sku;
    this.name_product = product.name_product;
    this.category = product.category;
    this.unit_price = product.unit_price;
    this.description = product.description;
    this.avatar = product.avatar;
    this.gallery = product.gallery;
  }
}
