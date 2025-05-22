import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptProvider {
  /**
   * 生成密码
   */
  public async generatePassword(password: string): Promise<string> {
    // 生成盐
    const salt: string = await bcrypt.genSalt(10);
    // 使用盐对密码进行哈希处理
    return await bcrypt.hash(password, salt);
  }

  // 确认密码
  comaprePassword(data: string | Buffer, encrypted: string): Promise<boolean> {
    return bcrypt.compare(data, encrypted);
  }
}
