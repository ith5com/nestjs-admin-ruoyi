import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { PERMISSION_KEY } from 'src/common/decorators/permission.decorator';
import { PUBLIC_AUTH_KEY } from 'src/common/decorators/public-auth.decorator';
import { AuthService } from 'src/modules/admin/auth/service/auth.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {}
  async canActivate(context: ExecutionContext) {
    // 获取权限code
    const permissionCode = this.reflector.getAllAndOverride<string>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );
    // isPublic 是否是公共接口, 如果为true，则直接返回true
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      PUBLIC_AUTH_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (isPublic) {
      return true;
    }

    // 如果权限code为空，则直接返回true
    if (!permissionCode) return true;
    const request: any = context.switchToHttp().getRequest<Request>();

    // 获取 jwt 挂载到user里面的id

    let user = request.user;
    console.log('user', user);
    // 管理员放开所有权限
    if (user.roleIds.includes(1)) return true;

    // 根据uid 去查找权限
    let allPermissions = await this.authService.getPermissions(user.sub);
    // 判断传入的code， 是否在所有权限code的数组中
    if (allPermissions.includes(permissionCode)) {
      return true;
    }
    return false;
  }
}
