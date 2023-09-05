import { TableSchema } from '../types/schema.type';
import { columnIncludeEnumSchemasDummy } from './columnSchema.dummy';
import { indexSchemasDummy } from './indexSchema.dummy';

export const tableSchemaDummy: TableSchema = {
  database: 'sample',
  name: 'sample',
  columns: columnIncludeEnumSchemasDummy,
  indexes: indexSchemasDummy,
};
