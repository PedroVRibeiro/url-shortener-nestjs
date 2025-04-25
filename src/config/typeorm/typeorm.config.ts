import { ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: (config: ConfigService): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: config.get<string>('DATABASE_HOST'),
    port: config.get<number>('DATABASE_PORT'),
    database: config.get<string>('DATABASE_NAME'),
    username: config.get<string>('DATABASE_USER'),
    password: config.get<string>('DATABASE_PASS'),
    entities: ['dist/**/*.entity.{ts,js}'],
    migrations: ['dist/migrations/*.{ts,js}'],
    autoLoadEntities: true,
    synchronize: false,
    logging: true,
    retryAttempts: 10,
    retryDelay: 3000,
  }),
};
