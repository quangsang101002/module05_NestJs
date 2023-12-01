import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserRequest } from '../requests/userRequests/create-user.request';
import { UsersService } from '../providers/users.service';
import { SearchUserRequest } from '../requests/userRequests/search-user.request';
import { UpdateUserRequest } from '../requests/userRequests/update-user.request';
import { AuthGuard } from 'src/guards/auth.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/auth/decorators/auth.decorator';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard)
  async index(@Query() searchRequest: SearchUserRequest) {
    return await this.usersService.search(
      searchRequest.keyword,
      searchRequest.page,
      searchRequest.limit,
    );
  }

  @Public()
  @Post()
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('avatar'))
  async create(
    @Body() requestBody: CreateUserRequest,

    @UploadedFile() avatar: Express.Multer.File,
  ) {
    await this.usersService.create(requestBody, avatar);
  }

  @Get('/:id')
  async show(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.find(id);
  }
  @Public()
  @Put('/:id')
  @UseInterceptors(FileInterceptor('avatar'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() requestBody: UpdateUserRequest,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    return await this.usersService.update(id, requestBody, avatar);
  }

  @Delete('/:id')
  @HttpCode(204)
  async destroy(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.delete(id);
  }
}
