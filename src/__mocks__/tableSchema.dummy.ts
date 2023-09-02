import { TableSchema } from '../index';
import { columnIncludeEnumSchemasDummy } from './columnSchema.dummy';
import { indexSchemasDummy } from './indexSchema.dummy';

export const tableSchemaDummy: TableSchema = {
  name: 'sample',
  columns: columnIncludeEnumSchemasDummy,
  indexes: indexSchemasDummy,
};
