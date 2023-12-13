import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginResponse } from '../responses/login.response';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginRequest } from '../requests/login.request';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserResponse } from 'src/users/responses/user.response';

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
      throw new UnauthorizedException('Không thể xác thực');
    }

    if (
      user.lockedUntil &&
      user.lockedUntil > new Date() &&
      (user.daysUntilUnlock || 0) > 0
    ) {
      throw new UnauthorizedException(
        `Tài khoản của bạn đã bị khóa. Số ngày còn lại: ${user.daysUntilUnlock}`,
      );
    }

    const isMatch = await bcrypt.compare(loginRequest.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Không thể xác thực');
    }

    const payload = { id: user.id, username: user.username };
    const token = await this.jwtService.signAsync(payload);
    const decoded = await this.jwtService.verifyAsync(token);

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

  async getAuth(id: number): Promise<UserResponse> {
    const user = await this.userRepository.findOneBy({ id });
    const userID = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('user.addresses', 'addresses')

      .where('user.id = :id', { id })
      .getOne();

    if (!user) {
      throw new NotFoundException();
    }
    const authResponse = new UserResponse(user);

    authResponse.profile = userID.profile.user_avatar;
    authResponse.phone_number = userID.profile.phone_number;
    authResponse.address = userID.profile.address;
    // authResponse.addresses = userID.addresses[];

    return authResponse;
  }
}
