import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { SearchProductRequest } from '../requests/productRequest/search-product.request';
import { productService } from '../providers/products.service';
import { createProductRequest } from '../requests/productRequest/create-product.request';
import { Public } from 'src/auth/decorators/auth.decorator';
import {
  FileFieldsInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';

@Controller('product')
export class ProductController {
  constructor(private searchProduct: productService) {}

  @Get()
  async search(@Query() searchProductRequest: SearchProductRequest) {
    console.log('searchProductRequest', searchProductRequest);

    return await this.searchProduct.search(
      searchProductRequest.keyword,
      searchProductRequest.page,
      searchProductRequest.limit,
    );
  }

  @Post()
  @HttpCode(201)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatar', maxCount: 1 },
      { name: 'gallery', maxCount: 12 },
    ]),
  )
  async create(
    @Body() requestBody: createProductRequest,
    @UploadedFiles()
    products: {
      avatar?: Express.Multer.File[];
      gallery?: Express.Multer.File[];
    },
  ) {
    return await this.searchProduct.create(requestBody, products);
  }
  @Get('/:id')
  async find(@Param('id', ParseIntPipe) id: number) {
    return await this.searchProduct.find(id);
  }

  @Put('/:id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatar', maxCount: 1 },
      { name: 'gallery', maxCount: 12 },
    ]),
  )
  async update(
    @UploadedFiles()
    products: {
      avatar?: Express.Multer.File[];
      gallery?: Express.Multer.File[];
    },
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBody: createProductRequest,
  ) {
    return await this.searchProduct.update(id, updateBody, products);
  }

  @Delete('/:id')
  async delete(@Param('id') id: number) {
    console.log('---id', id);

    return await this.searchProduct.delete(id);
  }
}
