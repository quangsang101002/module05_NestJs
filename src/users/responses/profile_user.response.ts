import { UserProfile } from '../entities/user-profile.entity';

export class UserResponse {
  id: number;

  avatar: string;

  address?: string;

  phone_number?: string;

  constructor(user_profile: UserProfile) {
    this.id = user_profile.id;
    this.address = user_profile.address;
    this.avatar = user_profile.user_avatar;
    this.phone_number = user_profile.phone_number;
  }
}
