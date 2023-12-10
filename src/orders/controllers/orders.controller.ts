import {
  Get,
  Post,
  Put,
  Delete,
  Controller,
  Param,
  Query,
  Body,
} from '@nestjs/common';
import { OrderService } from '../providers/orders.service';
import { SearchOrderRequest } from '../requests/orderRequest/search-order.request';
import { createOrderRequest } from '../requests/orderRequest/create-order.request';
import { updateOrderRequest } from '../requests/orderRequest/update-order.request';
@Controller('/order')
export class OrderController {
  constructor(private orderService: OrderService) {}
  @Get()
  search(@Query() search: SearchOrderRequest) {
    return this.orderService.search(search.keyword, search.page, search.limit);
  }
  // @Get('/:id')
  // find(@Param() id: number) {
  //   return this.orderService.find(id);
  // }
  @Post()
  create(@Body() requestBody: createOrderRequest) {
    return this.orderService.create(requestBody);
  }
  // @Put('/:id')
  // update(@Param() id: number, requestBody: updateOrderRequest) {
  //   return this.orderService.update(id, requestBody);
  // }
  @Delete('id')
  delete(@Param() id: number) {
    return this.orderService.delete(id);
  }
}
