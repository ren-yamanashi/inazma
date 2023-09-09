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

export const COLUMN_TYPE = {
  // number type
  INT: 'int',
  TINYINT: 'tinyint',
  INTEGER: 'integer',
  SMALLINT: 'smallint',
  MEDIUMINT: 'mediumint',
  BIGINT: 'bigint',
  FLOAT: 'float',
  DOUBLE: 'double',
  YEAR: 'year',
  BIT: 'bit',
  // boolean type
  BOOLEAN: 'boolean',
  // date type
  DATETIME: 'datetime',
  DATE: 'date',
  TIMESTAMP: 'timestamp',
  // string type
  CHAR: 'char',
  VARCHAR: 'varchar',
  DECIMAL: 'decimal',
  NUMERIC: 'numeric',
  TINYTEXT: 'tinytext',
  TEXT: 'text',
  MEDIUMTEXT: 'mediumtext',
  LONGTEXT: 'longtext',
  TIME: 'time',
  // union type
  SET: 'set',
} as const;

/**
 * Quote source
 * - https://github.dev/typeorm/typeorm/blob/master/src/decorator/columns/Column.ts
 * - https://dev.mysql.com/doc/refman/8.0/ja/literals.html
 */
export type ColumnType =
  | (typeof COLUMN_TYPE)[keyof typeof COLUMN_TYPE]
  | `varchar(${string})`
  | `enum(${string})`;
