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
