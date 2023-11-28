import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/entities/user.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ name: 'code', type: 'varchar', length: 10, unique: true })
  code: string;
  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @ManyToMany(() => User, (user: User) => user.roles)
  @JoinTable({ name: 'role_users' })
  users: User;
}
