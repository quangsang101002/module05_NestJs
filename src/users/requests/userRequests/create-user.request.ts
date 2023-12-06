import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsStrongPassword,
  // IsStrongPassword,
  Length,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

// https://github.com/typestack/class-validator#validation-decorators
export class CreateUserRequest {
  @IsNotEmpty()
  // @MinLength(4)
  // @MaxLength(10)
  username: string;

  // @IsNotEmpty()
  // @IsEmail()
  email: string;

  @IsOptional()
  @MaxLength(50)
  first_name: string;

  @IsOptional()
  @MaxLength(50)
  last_name: string;

  @IsNotEmpty()
  @Length(8, 20)
  @IsStrongPassword()
  password: string;

  @IsOptional()
  // @Min(1)
  // @Max(2)
  gender: number;
  @IsOptional()
  // @IsPhoneNumber('VN')
  phone_number: string;

  @IsOptional()
  @MaxLength(256)
  address: string;
  @IsOptional()
  userAvatar: string;
}
