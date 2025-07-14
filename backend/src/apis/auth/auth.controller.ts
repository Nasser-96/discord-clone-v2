import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { CanCreateUser } from './guards/can-create-user.guard';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @UseGuards(CanCreateUser)
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.createService(createAuthDto);
  }

  @Post('/login')
  login(@Body() createAuthDto: LoginDto) {
    return this.authService.loginService(createAuthDto);
  }
}
