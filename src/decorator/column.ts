import { ColumnType } from '../types/column.type';

export interface ColumnOptions {
  type: ColumnType;
  default?: unknown;
  unsigned?: boolean;
  unique?: boolean;
  primary?: boolean;
}

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
