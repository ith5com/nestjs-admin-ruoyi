import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './service/auth.service';
import { PublicAuth } from 'src/common/decorators/public-auth.decorator';

@ApiTags('登录模块')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiOperation({ summary: '系统用户登录' })
  @Post('login')
  @PublicAuth()
  public login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @PublicAuth()
  @Post('refresh-token')
  async refreshToken(@Body() body: { refreshToken: string }) {
    return await this.authService.refreshToken(body);
  }
}
