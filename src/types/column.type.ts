/**
 * Quote source
 * - https://github.dev/typeorm/typeorm/blob/master/src/decorator/columns/Column.ts
 * - https://dev.mysql.com/doc/refman/8.0/ja/literals.html
 */
export type PrimaryGeneratedColumnType =
  | 'int' // mysql, mssql, oracle, sqlite, sap
  | 'integer' // postgres, oracle, sqlite, mysql, cockroachdb, sap
  | 'tinyint' // mysql, mssql, sqlite, sap
  | 'smallint' // mysql, postgres, mssql, oracle, sqlite, cockroachdb, sap
  | 'mediumint' // mysql, sqlite
  | 'bigint' // mysql, postgres, mssql, sqlite, cockroachdb, sap
  | 'decimal'; // mysql, postgres, mssql, sqlite, sap

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
  | 'enum';
