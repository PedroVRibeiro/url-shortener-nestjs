import { ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: (config: ConfigService): TypeOrmModuleOptions => {
    const url = config.get<string>('DATABASE_URL');

    if (url) {
      return {
        type: 'postgres',
        url,
        ssl: { rejectUnauthorized: false },
        entities: ['dist/**/*.entity.{ts,js}'],
        migrations: ['dist/migrations/*.{ts,js}'],
        autoLoadEntities: true,
        synchronize: false,
        logging: true,
        retryAttempts: 10,
        retryDelay: 3000,
      };
    }

    return {
      type: 'postgres',
      host: config.get<string>('DATABASE_HOST'),
      port: parseInt(config.get<string>('DATABASE_PORT') || '5432', 10),
      username: config.get<string>('DATABASE_USER'),
      password: config.get<string>('DATABASE_PASS'),
      database: config.get<string>('DATABASE_NAME'),
      entities: ['dist/**/*.entity.{ts,js}'],
      migrations: ['dist/migrations/*.{ts,js}'],
      autoLoadEntities: true,
      synchronize: false,
      logging: true,
      retryAttempts: 10,
      retryDelay: 3000,
    };
  },
};
