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

@Module({
  imports: [
    databaseConfig,
    UsersModule,
    ProductModule,
    OrderModule,
    AuthModule,
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
