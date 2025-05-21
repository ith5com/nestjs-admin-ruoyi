import { createLogger, format, transports } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(({ timestamp, level, message, context }) => {
    return `[${timestamp as string}] [${level.toUpperCase()}]${context ? ` [${context as string}]` : ''}: ${message as string}`;
  }),
);

export const logger = createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    new DailyRotateFile({
      dirname: 'logs',
      filename: 'application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d', // 保留14天
    }),
    new transports.Console({
      format: format.combine(format.colorize(), logFormat),
    }),
  ],
});
