import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { PERMISSION_KEY } from 'src/common/decorators/permission.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const permissionCode = this.reflector.getAllAndOverride<string>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );
    const request: any = context.switchToHttp().getRequest<Request>();

    // 获取 jwt 挂载到user里面的id,
    // 根据userId 查找角色
    // 根据角色查找，所有的权限code
    // 判断传入的code， 是否在所有权限code的数组中
    // 返回： true / false
    return true;
  }
}
