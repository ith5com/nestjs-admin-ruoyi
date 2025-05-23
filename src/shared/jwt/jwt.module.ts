import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { SystemJwtStrategy } from './jwt.strategy.system';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'), // 不会用到，策略里覆盖
          signOptions: { expiresIn: '1h' },
        };
      },
    }),
  ],
  providers: [SystemJwtStrategy],
  exports: [JwtModule],
})
export class JwtAuthModule {}
