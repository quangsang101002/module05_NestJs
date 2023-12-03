import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginResponse } from '../responses/login.response';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginRequest } from '../requests/login.request';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}
  async login(loginRequest: LoginRequest): Promise<LoginResponse> {
    const user = await this.userRepository.findOneBy({
      username: loginRequest.username,
    });
    if (!user) {
      throw new UnauthorizedException('không thể xác thực');
    }
    const isMath = await bcrypt.compare(loginRequest.password, user.password);
    if (!isMath) {
      throw new UnauthorizedException('không thể xác thực');
    }

    const payload = { sub: user.id, username: user.username };

    const token = await this.jwtService.signAsync(payload);

    const loginResponse = new LoginResponse();
    loginResponse.token = token;
    return loginResponse;
  }
  async logOut(
    token: string | string[], // token có thể truyền 1 hoặc nhiều, chút nữa mình sẽ nói ở những phần sau
  ) {
    // tìm record token dựa theo token được gửi lên
    const authToken = await this.userRepository
      .createQueryBuilder()
      .innerJoinAndSelect(
        'AuthTokenEntity.account',
        'AccountEntity',
        'AccountEntity.deleted IS NULL',
      )
      .where('AuthTokenEntity.token = :token', { token })
      .getOne();

    if (!authToken) {
      throw UnauthorizedException;
    } // không tồn tại báo lỗi
    await this.userRepository.delete(authToken.id); // xóa token

    return true;
  }
}
