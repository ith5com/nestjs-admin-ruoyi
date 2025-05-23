import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { PUBLIC_AUTH_KEY } from 'src/common/decorators/public-auth.decorator';

@Injectable()
export class JwtSystemGuardGuard extends AuthGuard('system-jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      PUBLIC_AUTH_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}
