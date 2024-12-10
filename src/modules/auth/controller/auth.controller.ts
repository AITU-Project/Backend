import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SignInDto } from '../dto/sign-in.dto';
import { SignUpDto } from '../dto/sign-up.dto';
import { VerifyDto } from '../dto/verify.dto';
import { AuthGuard } from '../guards/auth.guard';
import { AuthService } from '../service/auth.service';
import { Roles } from '../../roles/decorator/roles.decorator';
import { RolesGuard } from 'src/modules/roles/guards/roles.guard';

@ApiTags('Auth Controller')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('sign-in')
  signIn(@Body() dto: SignInDto) {
    return this.auth.signIn(dto.email, dto.password);
  }

  @Post('sign-up')
  signUp(@Body() dto: SignUpDto) {
    return this.auth.signUp(dto);
  }

  @Post('verify')
  verify(@Body() dto: VerifyDto) {
    return this.auth.verify(dto);
  }
  @Roles('employee')
  @Get('profile')
  @UseGuards(AuthGuard, RolesGuard) 
  getProfile(@Request() request: any) {
    return this.auth.profile(request.user);
  }
}
