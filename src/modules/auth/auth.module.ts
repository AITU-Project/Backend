import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { RedisService } from '../../common/redis';
import { UsersModule } from '../users/users.module';

import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [
    UsersModule,
    RolesModule, 
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        global: true,
        secret: config.get<string>('auth.jwt.secret'),
        signOptions: {
          expiresIn: config.get<string>('auth.jwt.expiresIn'),
        },
      }),
    }),
  ],
  providers: [AuthService, RedisService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
