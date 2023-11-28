// import { SearchOrderRequest } from '../requests/orderRequest/search-order.request';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { NotFoundException } from '@nestjs/common';
import { OrderResponse } from '../responses/order.response';
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
  ) {}
  search(keyword?: string, page?: number, limit?: number) {
    this.orderRepository.findAndCount({
      where: {
        phone_number: ILike(`%${keyword || ''}`),
      },
      order: { order_id: 'DESC' },
      take: 5,
      skip: 0,
    });
  }
  async find(id: number): Promise<OrderResponse> {
    const order = await this.orderRepository.findOneBy({ order_id: id });

    if (!order) {
      throw new NotFoundException();
    }
    return new OrderResponse(order);
  }

  // create() {}
  // update() {}
  // delete() {}
}
