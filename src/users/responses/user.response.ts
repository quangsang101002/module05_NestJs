import { User } from '../entities/user.entity';

export class UserResponse {
  id: number;

  username: string;

  email: string;

  first_name?: string;

  last_name?: string;
  user_avatar: string;
  profile: string;
  phone_number: string;
  address: string;
  addresses: string;

  constructor(user: User) {
    this.id = user.id;
    this.username = user.username;
    this.email = user.email;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
  }
}
