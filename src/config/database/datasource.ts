import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

const isProduction = Boolean(process.env.DATABASE_URL);

if (!isProduction) {
  dotenv.config({ path: process.env.DOTENV_CONFIG_PATH || '.env' });
}

console.log('🔍 DATASOURCE VARS:', {
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  DATABASE_HOST: process.env.DATABASE_HOST,
  DATABASE_PORT: process.env.DATABASE_PORT,
});

const common = {
  entities: ['dist/**/*.entity.{js,ts}'],
  migrations: ['dist/migrations/*.{js,ts}'],
  synchronize: false,
};

export const AppDataSource = new DataSource(
  process.env.DATABASE_URL
    ? {
        type: 'postgres',
        url: process.env.DATABASE_URL!,
        ssl: { rejectUnauthorized: false },
        ...common,
      }
    : {
        type: 'postgres',
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT || '5432', 10),
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASS,
        database: process.env.DATABASE_NAME,
        ...common,
      },
);

