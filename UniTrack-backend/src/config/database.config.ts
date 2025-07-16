import * as path from 'node:path';
import { TypeOrmModule, type TypeOrmModuleOptions } from '@nestjs/typeorm';

const PATH_ENTITIES = path.join(
  __dirname,
  '..',
  '**',
  '{entity,entities}',
  '*.entity.{ts,js}',
);

export const typeOrmConfig: () => TypeOrmModuleOptions = () => ({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [PATH_ENTITIES],
  synchronize: true,
});

export const typeOrmModule = () => {
  return TypeOrmModule.forRootAsync({
    useFactory: typeOrmConfig,
  });
};

export default typeOrmConfig;
