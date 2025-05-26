import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtSystemGuardGuard } from 'src/common/guards/auth/jwt-system-auth.guard';
import { AuthService } from '../service/auth.service';
@UseGuards(JwtSystemGuardGuard)
@Controller('account')
export class AccountController {
  constructor(private readonly authService: AuthService) {}

  @Get('menus')
  async getMenus(@CurrentUser() user) {
    return this.authService.getMenus(user.userId);
  }

  @Get('permissions')
  async getPermissions(@CurrentUser() user) {
    return this.authService.getPermissions(user.userId);
  }
}
