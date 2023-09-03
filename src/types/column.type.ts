export const COLUMN_KEY = {
  PRI: 'PRI',
  UNI: 'UNI',
  MUL: 'MUL',
  NONE: '',
} as const;

export type ColumnKey = (typeof COLUMN_KEY)[keyof typeof COLUMN_KEY];

export const COLUMN_EXTRA = {
  AUTO_INCREMENT: 'auto_increment',
  DEFAULT_GENERATED: 'DEFAULT_GENERATED',
  VIRTUAL_GENERATED: 'VIRTUAL_GENERATED',
  STORED_GENERATED: 'STORED_GENERATED',
  ON_UPDATE_CURRENT_TIMESTAMP: 'on update CURRENT_TIMESTAMP',
  NONE: '',
} as const;

export type ColumnExtra = (typeof COLUMN_EXTRA)[keyof typeof COLUMN_EXTRA];

/**
 * Quote source
 * - https://github.dev/typeorm/typeorm/blob/master/src/decorator/columns/Column.ts
 * - https://dev.mysql.com/doc/refman/8.0/ja/literals.html
 */
export type ColumnType =
  // number type
  | 'int'
  | 'tinyint'
  | 'integer'
  | 'smallint'
  | 'mediumint'
  | 'bigint'
  | 'float'
  | 'double'
  | 'year'
  | 'bit'
  // boolean type
  | 'boolean'
  // date type
  | 'datetime'
  | 'date'
  | 'timestamp'
  // string type
  | 'char'
  | 'varchar'
  | `varchar(${string})`
  | 'decimal'
  | 'numeric'
  | 'tinytext'
  | 'text'
  | 'mediumtext'
  | 'longtext'
  | 'time'
  // union type
  | 'set'
  // enum type
  | `enum(${string})`;
