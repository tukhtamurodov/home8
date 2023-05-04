import { Pool } from 'pg';
import { DB_CONNECTION } from '../constants';

export const databaseProvider = {
  provide: DB_CONNECTION,
  useValue: new Pool({
    host: 'localhost',
    database: 'shops',
    password: '1290',
    port: 5432,
    user: 'postgres',
  }),
};
