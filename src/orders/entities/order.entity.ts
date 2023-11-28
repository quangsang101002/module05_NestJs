// order.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  order_id: number;

  @Column({ type: 'varchar', length: 10 })
  serial_number: string;

  @Column({ type: 'int', nullable: true })
  user_id: number;

  @Column({ type: 'datetime', nullable: true })
  ordered_at: Date;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone_number: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  delivery_address: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  total_price: number;

  @Column({ type: 'tinyint', nullable: true })
  status: number;

  @Column({ type: 'text', nullable: true })
  note: string;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @Column({ type: 'boolean', default: false })
  is_deleted: boolean;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;

  @Column({ type: 'int', nullable: true })
  created_by_id: number;

  @Column({ type: 'int', nullable: true })
  updated_by_id: number;
}
