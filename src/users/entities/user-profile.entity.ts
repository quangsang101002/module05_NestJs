import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_profile')
export class UserProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'gender', type: 'int', nullable: true })
  gender: number;

  @Column({ name: 'phone_number', type: 'varchar', length: 13, nullable: true })
  phone_number: string;

  @Column({ name: 'address', type: 'varchar', length: 320, nullable: true })
  address: string;
  @Column({ name: 'user_avatar', type: 'varchar', length: 355, nullable: true })
  user_avatar?: string;
  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
