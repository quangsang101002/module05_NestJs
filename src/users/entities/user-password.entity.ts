import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user-passwords')
export class UserPassword {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user: User) => user.passwords)
  @JoinColumn({ name: 'user_id' })
  user: User;
  @Column({ name: 'password', type: 'varchar', length: 255 })
  password: number;

  @Column({ name: 'is_actived', type: 'boolean' })
  isActived: boolean;
}
