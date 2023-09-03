import { ColumnType } from '../types/column.type';

type ColumnDecoratorOptions = {
  type: ColumnType;
  default?: unknown;
  unsigned?: boolean;
  unique?: boolean;
  primary?: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function columnDecorator(options: ColumnDecoratorOptions) {
  /**
   * @param {Object} target - デコレーターが適用されるクラスのプロトタイプ
   * @param {string | symbol} propertyKey - デコレーターが適用されるプロパティの名前
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return function (target: unknown, propertyKey: unknown, descriptor?: PropertyDescriptor): void {
    // TODO: デコレーターの処理の実装
  };
}

/**
 * extraの結果が`auto_increment`
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function autoIncrementColumnDecorator(options: ColumnDecoratorOptions) {
  /**
   * @param {Object} target - デコレーターが適用されるクラスのプロトタイプ
   * @param {string | symbol} propertyKey - デコレーターが適用されるプロパティの名前
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return function (target: unknown, propertyKey: unknown, descriptor?: PropertyDescriptor): void {
    // TODO: デコレーターの処理の実装
  };
}

/**
 * extraの結果が`VIRTUAL_GENERATED`
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function virtualGeneratedColumnDecorator(options: ColumnDecoratorOptions) {
  /**
   * @param {Object} target - デコレーターが適用されるクラスのプロトタイプ
   * @param {string | symbol} propertyKey - デコレーターが適用されるプロパティの名前
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return function (target: unknown, propertyKey: unknown, descriptor?: PropertyDescriptor): void {
    // TODO: デコレーターの処理の実装
  };
}

/**
 * extraの結果が`STORED GENERATED`
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function storedGeneratedColumnDecorator(options: ColumnDecoratorOptions) {
  /**
   * @param {Object} target - デコレーターが適用されるクラスのプロトタイプ
   * @param {string | symbol} propertyKey - デコレーターが適用されるプロパティの名前
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return function (target: unknown, propertyKey: unknown, descriptor?: PropertyDescriptor): void {
    // TODO: デコレーターの処理の実装
  };
}

/**
 * extraの結果が`DEFAULT GENERATED`
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function defaultGeneratedColumnDecorator(options: ColumnDecoratorOptions) {
  /**
   * @param {Object} target - デコレーターが適用されるクラスのプロトタイプ
   * @param {string | symbol} propertyKey - デコレーターが適用されるプロパティの名前
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return function (target: unknown, propertyKey: unknown, descriptor?: PropertyDescriptor): void {
    // TODO: デコレーターの処理の実装
  };
}

/**
 * extraの結果が`on update CURRENT_TIMESTAMP`
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function onUpdateCurrentTimestampColumnDecorator(options: ColumnDecoratorOptions) {
  /**
   * @param {Object} target - デコレーターが適用されるクラスのプロトタイプ
   * @param {string | symbol} propertyKey - デコレーターが適用されるプロパティの名前
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return function (target: unknown, propertyKey: unknown, descriptor?: PropertyDescriptor): void {
    // TODO: デコレーターの処理の実装
  };
}
