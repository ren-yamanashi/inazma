import { schemaGen } from './commands/schemaGen.command';
import {
  autoIncrementColumnDecorator,
  columnDecorator,
  defaultGeneratedColumnDecorator,
  onUpdateCurrentTimestampColumnDecorator,
  storedGeneratedColumnDecorator,
  virtualGeneratedColumnDecorator,
} from './decorator/column.decorator';
import { registerContainer } from './di';
import { getNowDate } from './helpers/datetime';

(async () => {
  registerContainer();

  await schemaGen({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'sample',
  });
})();

export const NOW = getNowDate;
export const Column = columnDecorator;
export const AutoIncrementColumn = autoIncrementColumnDecorator;
export const VirtualGeneratedColumn = virtualGeneratedColumnDecorator;
export const StoredGeneratedColumn = storedGeneratedColumnDecorator;
export const DefaultGeneratedColumn = defaultGeneratedColumnDecorator;
export const OnUpdateCurrentTimestampColumn = onUpdateCurrentTimestampColumnDecorator;

export default {
  NOW,
  Column,
  AutoIncrementColumn,
  VirtualGeneratedColumn,
  StoredGeneratedColumn,
  DefaultGeneratedColumn,
  OnUpdateCurrentTimestampColumn,
};
