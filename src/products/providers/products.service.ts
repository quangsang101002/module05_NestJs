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
    console.log('keyword', keyword);
    return await this.productRepository.findAndCount({
      where: [
        { name_product: ILike(`%${keyword || ''}%`) },
        { description: ILike(`%${keyword || ''}%`) },
        { sku: ILike(`%${keyword || ''}%`) },
      ],

      order: { id: 'ASC' },
      take: limit || 10, // Số lượng bản ghi trả về mặc định là 10 nếu limit không được cung cấp
      skip: Math.max(0, (page || 1) - 1) * (limit || 10),
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

    let productAvatarPath = null;
    let avatar = null;

    if (products.avatar) {
      for (const image of products.avatar) {
        originalname = image.originalname;
        const productExtension = getFileExtension(originalname);

        // Vấn đề: Ghi đè các biến trong mỗi vòng lặp
        productAvatarPath = `avatar_pd/${products.avatar.length}.${productExtension}`;
        productLocationAvatar = `./dist/public/${productAvatarPath}`;

        fs.writeFileSync(productLocationAvatar, image.buffer);
      }
    }
    let productPath = null;
    const galleryPaths: string[] = [];
    if (products.gallery) {
      for (let i = 0; i < products.gallery.length; i++) {
        const image = products.gallery[i];

        originalname = image.originalname;
        const productExtension = getFileExtension(originalname);

        // Sử dụng một định danh duy nhất (index) cho mỗi ảnh
        productPath = `products/anh-${i + 1}.${productExtension}`;
        productLocation = `./dist/public/${productPath}`;

        fs.writeFileSync(productLocation, image.buffer);
        galleryPaths.push(productPath);
      }
    }

    const product = new Product();
    product.sku = requestBody.sku;
    product.name_product = requestBody.name_product;
    product.category = requestBody.category;
    product.description = requestBody.description;
    product.unit_price = requestBody.unit_price;
    product.avatar = productAvatarPath;
    product.gallery = galleryPaths.join(',');

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
    requestBody: UpdateProductRequest,
    products: {
      avatar?: Express.Multer.File[];
      gallery?: Express.Multer.File[];
    },
  ): Promise<UpdateProductRequest> {
    let originalname: string | null = null;
    let paths: string | null = null;
    let productLocationAvatar: string | null = null;
    let productLocation: string | null = null;
    let productPathAvatar = null;
    if (products.avatar) {
      for (let i = 0; i < products.avatar.length; i++) {
        const avatar_pd = products.avatar[i];
        originalname = avatar_pd.originalname;
        const productExtension = getFileExtension(originalname);

        // Sử dụng timestamp làm định danh duy nhất
        const timestamp = new Date().getTime();
        productPathAvatar = `avatar_pd/${timestamp}_${i}.${productExtension}`;
        productLocationAvatar = `./dist/public/${productPathAvatar}`;

        fs.writeFileSync(productLocationAvatar, avatar_pd.buffer);
      }
    }

    const galleryPaths: string[] = [];
    let productPath = null;
    if (products.gallery) {
      for (let i = 0; i < products.gallery.length; i++) {
        const image = products.gallery[i];
        originalname = image.originalname;
        const productExtension = getFileExtension(originalname);

        // Sử dụng timestamp làm định danh duy nhất
        const timestamp = new Date().getTime();
        productPath = `products/anh-${i + 1}_${timestamp}.${productExtension}`;
        productLocation = `./dist/public/${productPath}`;

        fs.writeFileSync(productLocation, image.buffer);
        galleryPaths.push(productPath);
      }
    }

    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException();
    }

    const updateProduct = requestBody;

    updateProduct.avatar = productPathAvatar;

    updateProduct.gallery = galleryPaths.join(',');

    this.productRepository.update({ id: id }, updateProduct);
    return this.find(id);
  }

  async delete(id: number): Promise<void> {
    console.log('---', id);

    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException();
    }
    this.productRepository.softRemove({ id: id });
  }
}
