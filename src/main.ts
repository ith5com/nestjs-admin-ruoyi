import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TransformDataInterceptor } from './common/interceptors/transform-data.interceptor';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/exceptions/http-exception-filter.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('若依管理系统')
    .setVersion('1.0')
    .setDescription('接口文档')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformDataInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 自动移除多余字段
      forbidNonWhitelisted: true, // 拒绝非 DTO 声明字段
      transform: true, // 自动转类型
      exceptionFactory: (errors) => {
        const messages = errors.flatMap((err) =>
          Object.values(err.constraints || {}),
        );
        return new BadRequestException({
          code: 400,
          message: messages[0] || '参数校验失败',
          data: null,
        });
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
