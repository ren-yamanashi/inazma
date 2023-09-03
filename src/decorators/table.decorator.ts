/**
 * Columnのdecoratorの種類は `SHOW INDEX FROM <テーブル名>` の結果に依存する
 * docs: https://dev.mysql.com/doc/refman/8.0/ja/show-index.html
 */

type IndexDecoratorOptions = {
  name: string;
  columns: string[];
  // TODO: optionsの調査と追加
  config?: { unique: boolean };
};

type EntityDecoratorOptions = {
  name: string;
  config: { database: string };
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function indexDecorator(options: IndexDecoratorOptions) {
  /**
   * @param {Object} target - デコレーターが適用されるクラスのプロトタイプ
   * @param {string | symbol} propertyKey - デコレーターが適用されるプロパティの名前
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return function (target: unknown, propertyKey: unknown, descriptor?: PropertyDescriptor): void {
    // TODO: デコレーターの処理の実装
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function entityDecorator(options: EntityDecoratorOptions) {
  /**
   * @param {Object} target - デコレーターが適用されるクラスのプロトタイプ
   * @param {string | symbol} propertyKey - デコレーターが適用されるプロパティの名前
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return function (target: unknown, propertyKey: unknown, descriptor?: PropertyDescriptor): void {
    // TODO: デコレーターの処理の実装
  };
}
