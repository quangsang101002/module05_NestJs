import { Controller, Post, Body, Headers } from '@nestjs/common';
import { AuthService } from '../providers/auth.service';
import { LoginResponse } from '../responses/login.response';
import { LoginRequest } from '../requests/login.request';
import { Public } from 'src/auth/decorators/auth.decorator';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}
  @Public()
  @Post('login')
  async login(@Body() loginRequest: LoginRequest): Promise<LoginResponse> {
    return await this.authService.login(loginRequest);
  }

  @Post('logout')
  async logOut(
    @Headers('authorization') token: string | string[],
  ): Promise<boolean> {
    return await this.authService.logOut(token);
  }
}
