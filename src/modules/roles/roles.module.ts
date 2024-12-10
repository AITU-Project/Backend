import { Module } from '@nestjs/common';
import { RolesService } from './service/roles.service';
import { RolesGuard } from './guards/roles.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({}),
  ],
  providers: [RolesService, RolesGuard],
  exports: [RolesService],
})
export class RolesModule {}
