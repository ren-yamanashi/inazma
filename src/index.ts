import { Sample, User } from '../.out/db.schema';
import { migrationEntity } from './commands/migrationEntity.command';
import { registerContainer } from './di';
import { getNowDate } from './helpers/datetime';

const mysqlConfig = {
  host: 'localhost',
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: 'sample',
};

(async () => {
  registerContainer();

  // await schemaGen(mysqlConfig);
  await migrationEntity([Sample, User], mysqlConfig);
})();

export const NOW = getNowDate;
