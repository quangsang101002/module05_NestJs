import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * https://orkhan.gitbook.io/typeorm/docs/decorator-reference
 */
import { UserProfile } from './user-profile.entity';
import { UserPassword } from './user-password.entity';
import { Role } from '../../orders/role.entity';
import { Comment } from './comment.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Address } from './address.entiry';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ name: 'first_name', type: 'varchar', length: 50, nullable: true })
  first_name?: string;

  @Column({ name: 'last_name', type: 'varchar', length: 50, nullable: true })
  last_name?: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;
  @Column({ type: 'varchar', length: 255 })
  @Column({ nullable: true })
  lockedUntil: Date; // Thời điểm mà tài khoản sẽ được mở khóa
  @Column({ nullable: true })
  daysUntilUnlock: number; // Số ngày còn lại mở khóa
  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;

  /**
   * NULL: chưa xóa
   * Có giá trị: thời điểm bản ghi bị xóa
   */
  @DeleteDateColumn({ name: 'deleted_at', type: 'datetime' })
  deletedAt?: Date;

  @OneToOne(() => UserProfile, (profile: UserProfile) => profile.user)
  profile: UserProfile;
  @OneToMany(
    () => UserPassword,
    (userpassword: UserPassword) => userpassword.user,
  )
  passwords: UserPassword[];
  @ManyToMany(() => Role, (UserRole: Role) => UserRole.users)
  roles: Role[];
  @OneToMany(() => Comment, (userComments: Comment) => userComments.user)
  comments: Comment[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];
}
