import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { ILike, Repository } from 'typeorm';
import { createProductRequest } from '../requests/productRequest/create-product.request';
import { ProductResponse } from '../responses/product.response';
import { NotFoundException, UploadedFiles } from '@nestjs/common';
import { UpdateProductRequest } from '../requests/productRequest/update-product.request';
import { getFileExtension } from 'src/utilities/upload.util';
import * as fs from 'fs';
export class productService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async search(
    keyword?: string,
    page?: number,
    limit?: number,
  ): Promise<[Product[], number]> {
    return await this.productRepository.findAndCount({
      where: [
        { name_product: ILike(`%${keyword || ''}`) },
        { description: ILike(`%${keyword || ''}`) },
        { sku: ILike(`%${keyword || ''}`) },
      ],
      order: { id: 'DESC' },
      take: limit,
      skip: page,
    });
  }

  async create(
    requestBody: createProductRequest,
    products: {
      avatar?: Express.Multer.File[];
      gallery?: Express.Multer.File[];
    },
  ): Promise<void> {
    let originalname: string | null = null;
    let paths: string | null = null;
    let productLocationAvatar: string | null = null;
    let productLocation: string | null = null;

    let productPath = null;
    let avatar = null;

    if (products.avatar) {
      for (const image of products.avatar) {
        originalname = image.originalname;
        const productExtension = getFileExtension(originalname);

        // Vấn đề: Ghi đè các biến trong mỗi vòng lặp
        productPath = `products/${products.avatar.length}.${productExtension}`;
        productLocationAvatar = `./public/${productPath}`;

        fs.writeFileSync(productLocationAvatar, image.buffer);
      }
    }

    if (products.gallery) {
      for (let i = 0; i < products.gallery.length; i++) {
        const image = products.gallery[i];

        originalname = image.originalname;
        const productExtension = getFileExtension(originalname);

        // Sử dụng một định danh duy nhất (index) cho mỗi ảnh
        productPath = `products/anh-${i + 1}.${productExtension}`;
        productLocation = `./public/${productPath}`;

        fs.writeFileSync(productLocation, image.buffer);
      }
    }

    const product = new Product();
    product.sku = requestBody.sku;
    product.name_product = requestBody.name_product;
    product.category = requestBody.category;
    product.description = requestBody.description;
    product.avatar = productLocationAvatar;
    product.gallery = productLocation;

    await this.productRepository.save(product);
  }

  async find(id: number): Promise<ProductResponse> {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException();
    }
    return new ProductResponse(product);
  }
  async update(
    id: number,
    requestBody: createProductRequest,
  ): Promise<UpdateProductRequest> {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException();
    }

    this.productRepository.update({ id: id }, requestBody);
    return this.find(id);
  }
  async delete(id: number): Promise<void> {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException();
    }
    this.productRepository.softRemove({ id: id });
  }
}
