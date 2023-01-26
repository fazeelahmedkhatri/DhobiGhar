import { appEnv } from './src/helpers/EnvHelper';

/* eslint-disable prettier/prettier */
module.exports = {
  type: appEnv('DATABASE_TYPE'),
  host: appEnv('DATABASE_HOST'),
  port: appEnv('DATABASE_PORT'),
  username: appEnv('DATABASE_USERNAME'),
  password: appEnv('DATABASE_PASSWORD'),
  database: appEnv('DATABASE_NAME'),
  migrations: ['/dist/migrations/*{.ts,.js}'],
  entities: ['src/modules/**/*.entity.{ts,js}'],
};
