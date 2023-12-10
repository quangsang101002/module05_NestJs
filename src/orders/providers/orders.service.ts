// import { SearchOrderRequest } from '../requests/orderRequest/search-order.request';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, ILike, Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { NotFoundException } from '@nestjs/common';
import { OrderResponse } from '../responses/order.response';
import { createOrderRequest } from '../requests/orderRequest/create-order.request';
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    private dataSource: DataSource,
  ) {}
  search(keyword?: string, page?: number, limit?: number) {
    this.orderRepository.findAndCount({
      where: {
        phone_number: ILike(`%${keyword || ''}%`),
      },
      order: { id: 'ASC' },
      take: limit || 10, // Số lượng bản ghi trả về mặc định là 10 nếu limit không được cung cấp
      skip: Math.max(0, (page || 1) - 1) * (limit || 10),
    });
  }
  // async find(id: number): Promise<OrderResponse> {
  //   const order = await this.orderRepository.findOneBy({ order_id: id });

  //   if (!order) {
  //     throw new NotFoundException();
  //   }
  //   return new OrderResponse(order);
  // }

  async create(requestBody: createOrderRequest): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order: Order = new Order();
      order.phone_number = requestBody.phone_number;
      order.serial_number = requestBody.serial_number;
      order.delivery_address = requestBody.delivery_address;
      order.status = requestBody.status;
      order.total_price = requestBody.total_price;
      order.user_id = requestBody.user_id;

      await queryRunner.manager.save(order);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // update() {}
  async delete(id: number): Promise<void> {
    const user: Order = await this.orderRepository.findOneBy({ id });

    // Kiểm tra người dùng có tồn tại hay không ?
    if (!user) {
      throw new NotFoundException();
    }

    this.orderRepository.softRemove({ id });
  }
}
