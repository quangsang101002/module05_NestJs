import {
  IsOptional,
  IsStrongPassword,
  MaxLength,
  Length,
} from 'class-validator';

// https://github.com/typestack/class-validator#validation-decorators
export class UpdateUserRequest {
  @IsOptional()
  @MaxLength(50)
  first_name: string;

  @IsOptional()
  @MaxLength(50)
  last_name: string;
  @IsOptional()
  username: string;
  @IsOptional()
  // @IsStrongPassword()
  @Length(8, 20)
  password?: string;

  @IsOptional()
  user_avatar?: string;

  @IsOptional()
  gender?: number;

  @IsOptional()
  address?: string;

  @IsOptional()
  email?: string;
  @IsOptional()
  phone_number: string;
}
