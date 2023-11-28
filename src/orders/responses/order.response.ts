import { Order } from '../entities/order.entity';

export class OrderResponse {
  serial_number: string;
  user_id: number;
  ordered_at: Date;
  phone_number: string;
  delivery_address: string;
  total_price: number;
  status: number;
  note: string;
  is_deleted: boolean;
  created_by_id: number;
  updated_by_id: number;

  constructor(order: Order) {
    this.serial_number = order.serial_number;
    this.user_id = order.user_id;
    this.ordered_at = order.ordered_at;
    this.phone_number = order.phone_number;
    this.delivery_address = order.delivery_address;
    this.total_price = order.total_price;
    this.status = order.status;
    this.note = order.note;
    this.is_deleted = order.is_deleted;
    this.created_by_id = order.created_by_id;
    this.updated_by_id = order.updated_by_id;
  }
}
