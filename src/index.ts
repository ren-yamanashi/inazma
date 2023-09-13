import { schemaGen } from './commands/schemaGen.command';
import {
  autoIncrementColumnDecorator,
  columnDecorator,
  defaultGeneratedColumnDecorator,
  onUpdateCurrentTimestampColumnDecorator,
  storedGeneratedColumnDecorator,
  virtualGeneratedColumnDecorator,
} from './decorators/column.decorator';
import { entityDecorator, indexDecorator } from './decorators/table.decorator';
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

  // migrationEntity();
})();

export const NOW = getNowDate;
export const Column = columnDecorator;
export const AutoIncrementColumn = autoIncrementColumnDecorator;
export const VirtualGeneratedColumn = virtualGeneratedColumnDecorator;
export const StoredGeneratedColumn = storedGeneratedColumnDecorator;
export const DefaultGeneratedColumn = defaultGeneratedColumnDecorator;
export const OnUpdateCurrentTimestampColumn = onUpdateCurrentTimestampColumnDecorator;
export const Index = indexDecorator;
export const Entity = entityDecorator;

export default {
  NOW,
  Column,
  AutoIncrementColumn,
  VirtualGeneratedColumn,
  StoredGeneratedColumn,
  DefaultGeneratedColumn,
  OnUpdateCurrentTimestampColumn,
  Index,
  Entity,
};
