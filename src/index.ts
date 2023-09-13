import { schemaGen } from './commands/schemaGen.command';
import { registerContainer } from './di';
import { getNowDate } from './helpers/datetime';

(async () => {
  registerContainer();

  await schemaGen({
    host: 'localhost',
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: 'sample',
  });

  // migrationEntity();
})();

export const NOW = getNowDate;

export default {
  NOW,
};
