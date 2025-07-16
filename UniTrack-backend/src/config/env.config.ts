import { ConfigModule } from '@nestjs/config';
import typeOrmConfig from './database.config';

export const envConfig = () =>
  ConfigModule.forRoot({
    isGlobal: true,
    expandVariables: true,
    load: [typeOrmConfig],
  });
