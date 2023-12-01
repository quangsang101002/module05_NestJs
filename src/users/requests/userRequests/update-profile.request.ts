import {
  IsOptional,
  IsStrongPassword,
  MaxLength,
  Length,
} from 'class-validator';

// https://github.com/typestack/class-validator#validation-decorators
export class UpdateProfileRequest {
  @IsOptional()
  user_avatar?: string;

  @IsOptional()
  gender?: number;

  @IsOptional()
  address?: string;
  @IsOptional()
  phone_number: string;
}
