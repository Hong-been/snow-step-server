import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService); // DI(컨테이너, 의존성을 포함하여 완성된 객체를 만들어 반환하는 Nestjs 공장에 비유. 필요한 의존성을 스스로 찾고 조립.)
  const port = configService.get('port');
  const env = configService.get('NODE_ENV');
  env === 'development' && app.enableCors();

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('Snow Step API Documentation') // API 문서 제목
    .setDescription('API endpoints for our application') // 설명
    .setVersion('1.0') // 버전
    .addBearerAuth() // JWT Bearer 인증 추가
    .build();

  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
  };
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, customOptions); // '/api' 경로에서 Swagger UI 제공

  await app.listen(port, () =>
    console.log(`Server is listening! Port is ${port}`),
  );
  app.useGlobalPipes(new ValidationPipe());
}
bootstrap();
