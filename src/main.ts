import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config'; 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService) // DI(컨테이너, 의존성을 포함하여 완성된 객체를 만들어 반환하는 Nestjs 공장에 비유. 필요한 의존성을 스스로 찾고 조립.)
  const port = configService.get("port")

  await app.listen(port, () => console.log(`Server is listening! Port is ${port}`));
}
bootstrap();
