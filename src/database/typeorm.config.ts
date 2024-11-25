import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TypeormConfig implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    const config: TypeOrmModuleOptions = {
      // url: '', // postgresql://username:password@hostname:port/database
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'snow-step',
      autoLoadEntities: true,
      synchronize: true, // TODO: 스키마 자동 동기화 (production에서는 false)
      entities: [__dirname + '/../**/*.entity{.ts,.js}'], //TODO: 중요! 엔티티 클래스 경로
    };

    return config;
  }
}
