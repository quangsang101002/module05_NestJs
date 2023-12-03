import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserRequest } from '../requests/userRequests/create-user.request';
import { User } from '../entities/user.entity';
import { UpdateUserRequest } from '../requests/userRequests/update-user.request';
import { UserResponse } from '../responses/user.response';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, ILike, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { SALT_OR_ROUNDS } from 'src/common/constants';
import { UserProfile } from '../entities/user-profile.entity';
import { getFileExtension } from 'src/utilities/upload.util';
import { UpdateProfileRequest } from '../requests/userRequests/update-profile.request';
import * as fs from 'fs';
// Tài liệu: https://docs.nestjs.com/providers#services
@Injectable()
export class UsersService {
  // private static users: Array<User> = [];
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private userProfileRepository: Repository<UserProfile>,
    private dataSource: DataSource,
  ) {}

  async search(
    keyword?: string,
    page?: number,
    limit?: number,
  ): Promise<[User[], number]> {
    return await this.userRepository.findAndCount({
      relations: {
        profile: true,
        passwords: true,
        roles: true,
        comments: true,
      },
      where: {
        username: ILike(`%${keyword || ''}`),
      },
      order: { id: 'ASC' },
      take: 10, //limit
      skip: 0, //offset
    });
  }

  async create(
    createUser: CreateUserRequest,
    avatar: Express.Multer.File,
  ): Promise<void> {
    let originalname: string | null = null;
    let paths: string | null = null;
    let avatarLocation: string | null = null;

    if (avatar) {
      originalname = avatar.originalname;
      paths = avatar.path;
    }

    const isExistEmailOrUsername = await this.userRepository.findOne({
      where: [{ username: createUser.username }, { email: createUser.email }],
    });

    if (isExistEmailOrUsername) {
      throw new BadRequestException();
    }

    let avatarPath = null;

    if (avatar) {
      const avatarExtension = getFileExtension(originalname);
      avatarPath = `avatar/${createUser.username}.${avatarExtension}`;
      avatarLocation = `./public/${avatarPath}`;

      // Ghi file vào thư mục lưu trữ
      fs.writeFileSync(avatarLocation, avatar.buffer);
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user: User = new User();
      user.username = createUser.username;
      user.email = createUser.email;
      user.first_name = createUser.firstName;
      user.last_name = createUser.lastName;
      user.password = await bcrypt.hash(createUser.password, SALT_OR_ROUNDS);
      await queryRunner.manager.save(user);

      const userProfile = new UserProfile();
      userProfile.gender = createUser.gender;
      userProfile.phone_number = createUser.phoneNumber;
      userProfile.address = createUser.address;
      userProfile.user_avatar = avatarLocation;

      await queryRunner.manager.save(userProfile);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();

      if (avatarLocation) {
        fs.rmSync(avatarLocation);
      }

      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async find(id: number): Promise<UserResponse> {
    // const user: User = UsersService.users.find(
    //   (value) => value.id === id && !value.deletedAt,
    // );

    const user = await this.userRepository.findOneBy({ id });
    // Kiểm tra người dùng có tồn tại hay không ?
    if (!user) {
      throw new NotFoundException();
    }

    return new UserResponse(user);
  }

  async update(
    id: number,
    updateUser: UpdateUserRequest,
    avatar: Express.Multer.File,
  ): Promise<UserResponse> {
    let originalname: string | null = null;
    let paths: string | null = null;
    let avatarLocation: string | null = null;
    let avatarPath = null;

    const userID = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .where('user.id = :id', { id })
      .getOne();

    const profileId = userID.profile.id;
    if (avatar) {
      const avatarExtension = getFileExtension(avatar.originalname);
      avatarPath = `avatar/${updateUser.first_name}.${avatarExtension}`;
      avatarLocation = `./public/${avatarPath}`;

      // Ghi file vào thư mục lưu trữ
      fs.writeFileSync(avatarLocation, avatar.buffer);
    }

    const user = await this.userRepository.findOneBy({ id });

    // Kiểm tra người dùng có tồn tại hay không ?
    if (!user) {
      throw new NotFoundException();
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = new UpdateUserRequest();
      user.email = updateUser.email;
      user.first_name = updateUser.first_name;
      user.last_name = updateUser.last_name;
      user.password = await bcrypt.hash(updateUser.password, SALT_OR_ROUNDS);
      await this.userRepository.update({ id: id }, user);

      const userProfileToUpdate = new UpdateProfileRequest();
      userProfileToUpdate.phone_number = updateUser.phone_number;
      userProfileToUpdate.address = updateUser.address;
      userProfileToUpdate.user_avatar = avatarLocation;
      userProfileToUpdate.gender = updateUser.gender;
      await this.userProfileRepository.update(
        { id: profileId },
        userProfileToUpdate,
      );

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();

      if (avatarLocation) {
        fs.rmSync(avatarLocation);
      }

      throw err;
    } finally {
      await queryRunner.release();
    }

    return this.find(id);
  }

  async delete(id: number): Promise<void> {
    const user: User = await this.userRepository.findOneBy({ id });

    // Kiểm tra người dùng có tồn tại hay không ?
    if (!user) {
      throw new NotFoundException();
    }

    this.userRepository.softRemove({ id });
  }
}
