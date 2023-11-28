import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Comment } from '../../users/entities/comment.entity';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  sku: string;

  @Column({ type: 'varchar', length: 255 })
  name_product: string;

  @Column({ name: 'category', type: 'varchar', length: 50, nullable: true })
  category: number;

  @Column({ name: 'description', type: 'varchar', length: 50, nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  unit_price: number;

  @Column({ type: 'text', nullable: true })
  image: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'datetime' })
  deletedAt?: Date;

  @OneToMany(() => Comment, (userComments: Comment) => userComments.user)
  comments: Comment[];
}
