import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import databaseConfig from './config/database.config';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProductModule } from './users/products.module';

import { OrderModule } from './users/orders.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    databaseConfig,
    UsersModule,
    ProductModule,
    OrderModule,
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // Điều chỉnh đường dẫn tùy thuộc
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
