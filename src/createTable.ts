import { ColumnSchema } from './parseColumn';
import { IndexSchema } from './parseIndex';

export type TableSchema = {
  name: string;
  columns: ColumnSchema[];
  indexes: IndexSchema[];
};

export const createTable = (
  tableName: string,
  columns: ColumnSchema[],
  indexes: IndexSchema[],
): TableSchema => {
  return {
    name: tableName,
    columns,
    indexes,
  };
};
