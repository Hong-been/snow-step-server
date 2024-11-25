import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'src/config/config';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TypeormConfig } from './database/typeorm.config';
import { DataSource, DataSourceOptions } from 'typeorm';

/**
 * 모듈에서 컨트롤러와 서비스를 연결한다.
 * imports: 다른 모듈을 가져옴
 * controllers: 이 모듈에서 사용하는 컨트롤러 등록. 클라이언트 요청을 받는다.
 * providers: 의존성 주입을 위해 서비스 등록. 컨트롤러에서 이 서비스를 사용해서 비지니스 로직을 처리한다. 서비스는 독립적으로 동작할 수 있게 설계해야하고, 컨트롤러는 서비스에 의존한다.
 */
@Module({
  imports: [
    // https://dev.to/gmdias727/how-to-set-up-env-variables-in-a-nestjs-project-1o25
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeormConfig,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
