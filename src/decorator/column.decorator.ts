import { ColumnType } from '../types/column.type';

export const COLUMN_DECORATOR = {
  COLUMN: '@Column',
  AUTO_INCREMENT_COLUMN: '@AutoIncrementColumn',
  VIRTUAL_GENERATED_COLUMN: '@VirtualGeneratedColumn',
  STORED_GENERATED_COLUMN: '@StoredGeneratedColumn',
  DEFAULT_GENERATED_COLUMN: '@DefaultGeneratedColumn',
  ON_UPDATE_CURRENT_TIMESTAMP_COLUMN: '@OnUpdateCurrentTimestampColumn',
} as const;

export type ColumnDecorator = (typeof COLUMN_DECORATOR)[keyof typeof COLUMN_DECORATOR];
export interface ColumnOptions {
  type: ColumnType;
  default?: unknown;
  unsigned?: boolean;
  unique?: boolean;
  primary?: boolean;
}

/**
 * Columnのdecoratorの種類は`SHOW COLUMNS FROM <テーブル名>`の`Extra`の結果に依存する
 * docs: https://dev.mysql.com/doc/refman/8.0/ja/show-columns.html
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Column(options: ColumnOptions) {
  /**
   * @param {Object} target - デコレーターが適用されるクラスのプロトタイプ
   * @param {string | symbol} propertyKey - デコレーターが適用されるプロパティの名前
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return function (target: object, propertyKey: string | symbol): void {
    // TODO: デコレーターの処理の実装
  };
}

/**
 * extraの結果が`auto_increment`
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function AutoIncrementColumn(options: ColumnOptions) {
  /**
   * @param {Object} target - デコレーターが適用されるクラスのプロトタイプ
   * @param {string | symbol} propertyKey - デコレーターが適用されるプロパティの名前
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return function (target: object, propertyKey: string | symbol): void {
    // TODO: デコレーターの処理の実装
  };
}

/**
 * extraの結果が`VIRTUAL_GENERATED`
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function VirtualGeneratedColumn(options: ColumnOptions) {
  /**
   * @param {Object} target - デコレーターが適用されるクラスのプロトタイプ
   * @param {string | symbol} propertyKey - デコレーターが適用されるプロパティの名前
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return function (target: object, propertyKey: string | symbol): void {
    // TODO: デコレーターの処理の実装
  };
}

/**
 * extraの結果が`STORED GENERATED`
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function StoredGeneratedColumn(options: ColumnOptions) {
  /**
   * @param {Object} target - デコレーターが適用されるクラスのプロトタイプ
   * @param {string | symbol} propertyKey - デコレーターが適用されるプロパティの名前
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return function (target: object, propertyKey: string | symbol): void {
    // TODO: デコレーターの処理の実装
  };
}

/**
 * extraの結果が`DEFAULT GENERATED`
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function DefaultGeneratedColumn(options: ColumnOptions) {
  /**
   * @param {Object} target - デコレーターが適用されるクラスのプロトタイプ
   * @param {string | symbol} propertyKey - デコレーターが適用されるプロパティの名前
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return function (target: object, propertyKey: string | symbol): void {
    // TODO: デコレーターの処理の実装
  };
}

/**
 * extraの結果が`on update CURRENT_TIMESTAMP`
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function OnUpdateCurrentTimestampColumn(options: ColumnOptions) {
  /**
   * @param {Object} target - デコレーターが適用されるクラスのプロトタイプ
   * @param {string | symbol} propertyKey - デコレーターが適用されるプロパティの名前
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return function (target: object, propertyKey: string | symbol): void {
    // TODO: デコレーターの処理の実装
  };
}
