import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import * as bcrypt from 'bcrypt';
import { UserDataType } from './types';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import ReturnResponse from 'src/helper/returnResponse';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async createService({ username, password, email }: CreateAuthDto) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prismaService.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
    const userData: UserDataType = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    const token = await this.generateJWT(userData);

    return ReturnResponse({
      is_successful: true,
      response: {
        token,
      },
      success: 'User created successfully',
    });
  }

  async loginService({ identifier, password }: LoginDto) {
    const user = await this.prismaService.user.findFirst({
      where: {
        OR: [{ username: identifier }, { email: identifier }],
      },
      select: {
        id: true,
        username: true,
        email: true,
        password: true, // Ensure password is selected for comparison
      },
    });

    const badRequestError = new BadRequestException(
      ReturnResponse({
        is_successful: false,
        response: {
          message: 'Invalid credentials',
        },
      }),
    );

    if (!user) {
      throw badRequestError;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw badRequestError;
    }

    const userData: UserDataType = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    const token = await this.generateJWT(userData);
    return ReturnResponse({
      is_successful: true,
      response: {
        token,
      },
      success: 'Login successful',
    });
  }

  private async generateJWT(userData: UserDataType) {
    const timeToExpire = 60 * 60 * 24 * 2; // 2 days
    return this.jwtService.signAsync(
      {
        ...userData,
      },
      { secret: process.env.JSON_TOKEN_KEY, expiresIn: `${timeToExpire}s` },
    );
  }
}
