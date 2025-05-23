import { SetMetadata } from '@nestjs/common';

export const PUBLIC_AUTH_KEY = 'isPublicAuth';
export const PublicAuth = () => SetMetadata(PUBLIC_AUTH_KEY, true);
