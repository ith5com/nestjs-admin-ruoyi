import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { logger } from './logger';

@Injectable()
export class LoggerService implements NestLoggerService {
  log(message: string, context?: string) {
    logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string) {
    logger.error(`${message} - ${trace}`, { context });
  }

  warn(message: string, context?: string) {
    logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    logger.debug(message, { context });
  }

  verbose(message: string, context?: string) {
    logger.verbose(message, { context });
  }
}
