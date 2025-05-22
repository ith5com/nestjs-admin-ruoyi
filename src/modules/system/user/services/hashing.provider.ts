import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class HashingProvider {
  // 生成密码
  abstract generatePassword(data: string | Buffer): Promise<string>;

  // 比较密码
  abstract comaprePassword(
    data: string | Buffer,
    encrypted: string,
  ): Promise<boolean>;
}
