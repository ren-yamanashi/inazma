import { ColumnExtra, ColumnKey } from './column.type';
import { PrimitiveTypeString } from './primitive.type';

export type ColumnSchema = {
  field: string;
  typeInTs: PrimitiveTypeString | string;
  typeInDb: string;
  unsigned: boolean;
  nullable: boolean;
  key: ColumnKey;
  defaultValue: null | string;
  extra: ColumnExtra;
};

export type IndexSchema = {
  keyName: string;
  unique: boolean;
  columnNames: string[];
};

export type TableSchema = {
  name: string;
  columns: ColumnSchema[];
  indexes: IndexSchema[];
};
