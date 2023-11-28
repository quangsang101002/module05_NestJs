import { IsNotEmpty, IsStrongPassword, Length } from 'class-validator';
import { UserRole } from 'src/users/enums/user-role.enum';

export class LoginRequest {
  @IsNotEmpty()
  @Length(4, 20)
  //   @IsStrongPassword()
  password: string;
  @IsNotEmpty()
  @Length(4, 20)
  username: string;
  role?: UserRole = UserRole.CUSTOMER;
}
