/**
 * Columnのdecoratorの種類は`SHOW COLUMNS FROM <テーブル名>`の`Extra`の結果に依存する
 * docs: https://dev.mysql.com/doc/refman/8.0/ja/show-columns.html
 */
export const COLUMN_DECORATOR = {
  COLUMN: '@Column',
  AUTO_INCREMENT_COLUMN: '@AutoIncrementColumn',
  VIRTUAL_GENERATED_COLUMN: '@VirtualGeneratedColumn',
  STORED_GENERATED_COLUMN: '@StoredGeneratedColumn',
  DEFAULT_GENERATED_COLUMN: '@DefaultGeneratedColumn',
  ON_UPDATE_CURRENT_TIMESTAMP_COLUMN: '@OnUpdateCurrentTimestampColumn',
} as const;

export type ColumnDecorator = (typeof COLUMN_DECORATOR)[keyof typeof COLUMN_DECORATOR];

/**
 * Tableのdecoratorの種類は `SHOW INDEX FROM <テーブル名>` の結果に依存する
 * docs: https://dev.mysql.com/doc/refman/8.0/ja/show-index.html
 */
export const TABLE_DECORATOR = {
  INDEX: '@Index',
  ENTITY: '@Entity',
} as const;

export type TableDecorator = (typeof TABLE_DECORATOR)[keyof typeof TABLE_DECORATOR];
