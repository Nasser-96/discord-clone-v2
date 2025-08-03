import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import ReturnResponse from 'src/helper/returnResponse';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    const errorResponse = ReturnResponse({
      error_msg: 'You need to login first',
      is_successful: false,
    });

    if (!token) {
      console.log('Invalid token 1', token);
      throw new UnauthorizedException(errorResponse);
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JSON_TOKEN_KEY,
      });
      request['user'] = payload;
    } catch {
      console.log('Invalid token 2');
      throw new UnauthorizedException(errorResponse);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
