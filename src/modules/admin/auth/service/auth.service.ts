import { Injectable } from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { SysUserRepositoryService } from 'src/modules/admin/system/user/services/user-repository.service';
import { ErrorEnum } from 'src/common/enums/error.enum';
import { HashingProvider } from 'src/modules/admin/system/user/services/hashing.provider';
import { RedisService } from 'src/shared/redis/redis.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ErrorResponseException } from 'src/common/exceptions/error-response.exception';
import { MenuService } from 'src/modules/admin/system/menu/services/menu.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly sysUserRepositoryService: SysUserRepositoryService,
    private readonly hashingProvider: HashingProvider,
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly menuService: MenuService,
  ) {}
  /**
   * 登录
   * @param username 用户名
   * @param password 密码
   * @returns 登录成功后的用户信息、accessToken、refreshToken
   */
  public async login({ username, password }: LoginDto) {
    const user =
      await this.sysUserRepositoryService.findUserByUsername(username);
    if (!user) {
      throw new ErrorResponseException(ErrorEnum.SYSTEM_USER_PASSWORD_ERROR);
    }
    if (user.status === 0) {
      throw new ErrorResponseException(ErrorEnum.SYSTEM_USER_STATUS_ERROR);
    }

    const cachePassword = user.password;
    // 校验密码
    const isPass = await this.hashingProvider.comaprePassword(
      password,
      cachePassword,
    );
    if (!isPass) throw new Error(ErrorEnum.SYSTEM_USER_PASSWORD_ERROR);

    const payload = {
      sub: user.id,
      username: user.username,
      roleIds: user.roles.map((role) => role.id),
    };

    // 生成accessToken
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('jwt.system_secret'),
      expiresIn: '5m',
    });

    // 生成refreshToken
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('jwt.system_secret'),
      expiresIn: '7d',
    });
    // 存储到redis中，后面做挤兑下线功能
    await this.redisService.set(
      `accessToken:user_${user.id}`,
      accessToken,
      'EX',
      60 * 5 * 1,
    );
    // 存储到redis中，后面做挤兑下线功能
    await this.redisService.set(
      `refreshToken:user_${user.id}`,
      refreshToken,
      'EX',
      60 * 60 * 24 * 7,
    );
    return {
      user: {
        id: user.id,
        username: user.username,
        phone: user.phone,
        status: user.status,
      },
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  public async refreshToken(data: { refreshToken: string }) {
    let verifyData = {} as any;
    try {
      verifyData = await this.jwtService.verifyAsync(data.refreshToken, {
        secret: this.configService.get('jwt.system_secret'),
      });
    } catch (error) {
      throw new ErrorResponseException(ErrorEnum.SYSTEM_USER_UNAUTHORIZED);
    }

    let payload = {
      sub: verifyData.sub,
      username: verifyData.username,
      roleIds: verifyData.roleIds,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('jwt.system_secret'),
      expiresIn: '5m',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('jwt.system_secret'),
      expiresIn: '7d',
    });
    console.log({ accessToken, refreshToken });
    // 存储到redis中，后面做挤兑下线功能
    await this.redisService.set(
      `accessToken:user_${payload.sub}`,
      accessToken,
      'EX',
      60 * 5 * 1,
    );
    // 存储到redis中，后面做挤兑下线功能
    await this.redisService.set(
      `refreshToken:user_${payload.sub}`,
      refreshToken,
      'EX',
      60 * 60 * 24 * 7,
    );
    return { accessToken, refreshToken };
  }
  /**
   * 获取用户菜单
   * @param userId 用户ID
   * @returns 菜单列表
   */
  async getMenus(userId: number) {
    const menus = await this.menuService.findMenusByUserId(userId);
    return menus;
  }
  /**
   * 获取当前用户的所有权限
   */
  async getPermissions(userId: number): Promise<string[]> {
    const permissions = await this.menuService.findPermissionByUserId(userId);

    return permissions;
  }
}
