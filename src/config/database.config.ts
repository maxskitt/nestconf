import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Token } from '../tokens/entities/token.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'gcode',
  password: '',
  database: 'postgres',
  entities: [User, Token],
  synchronize: true,
};
