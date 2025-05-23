import { registerAs } from '@nestjs/config';

export const JwtConfig = registerAs('jwt', () => ({
  system_secret: process.env.JWT_SYSTEM_SECRET,
  expires_in: process.env.JWT_ACCESS_TOKEN_TTL,
}));
