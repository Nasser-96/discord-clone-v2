import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAuthDto } from '../dto/create-auth.dto';
import ReturnResponse from 'src/helper/returnResponse';

@Injectable()
export class CanCreateUser implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requestBody: CreateAuthDto = context
      .switchToHttp()
      .getRequest()?.body;
    const token: string = context
      .switchToHttp()
      .getRequest()
      ?.headers?.authorization?.replaceAll('Bearer', '');

    if (token) {
      throw new BadRequestException(
        ReturnResponse({
          is_successful: false,
          response: {
            message: 'you are already logged in, please logout first',
          },
        }),
      );
    }

    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: requestBody.username }, { email: requestBody.email }],
      },
    });

    if (user) {
      throw new BadRequestException(
        ReturnResponse({
          is_successful: false,
          response: {
            message: 'Try another username or email',
          },
        }),
      );
    }

    return true;
  }
}
