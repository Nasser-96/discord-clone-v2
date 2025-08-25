import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDataType } from 'src/apis/auth/types';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserDataType => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
