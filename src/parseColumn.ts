import { matchFn } from './helpers/match';

const defaultColumn: ColumnSchema = {
  field: '',
  type: '',
  nullable: false,
  key: '',
  defaultValue: null,
  extra: '',
};

export const COLUMN_KEY = {
  PRI: 'PRI',
  UNI: 'UNI',
  MUL: 'MUL',
  NONE: '',
} as const;

export const PRIMITIVE_TYPE = {
  NUMBER: 'number',
  BIGINT: 'bigint',
  STRING: 'string',
  BOOLEAN: 'boolean',
  NULL: 'null',
  UNDEFINED: 'undefined',
  DATE: 'Date',
  UNKNOWN: 'unknown',
};

export type PrimitiveTypeString = (typeof PRIMITIVE_TYPE)[keyof typeof PRIMITIVE_TYPE];

export type ColumnKey = (typeof COLUMN_KEY)[keyof typeof COLUMN_KEY];

export type ColumnSchema = {
  field: string;
  type: PrimitiveTypeString | string;
  nullable: boolean;
  key: ColumnKey;
  defaultValue: null | string;
  extra: string;
};

type ParseOptions = {
  convertTypeFn: (type: string) => PrimitiveTypeString;
};

/**
 * MySQLクエリから取得したテーブル列のスキーマ情報を解析して、厳密に型指定されたTableSchemaオブジェクトを生成
 * @param {object} arg - MySQLクエリから取得したテーブル列のスキーマ
 * @returns {TableSchema} - 厳密に型指定されたTableSchemaオブジェクト
 */
export const parseColumn = (
  arg: { [key: string]: unknown },
  options: ParseOptions,
): ColumnSchema => {
  // NOTE: オブジェクトの参照を毎回生成する
  const column = Object.assign({}, defaultColumn);
  if ('Field' in arg && typeof arg['Field'] === 'string') column.field = arg['Field'];
  if ('Null' in arg) column.nullable = arg['Null'] === 'YES';
  if ('Key' in arg && typeof arg['Key'] === 'string') column.key = arg['Key'] as ColumnKey;
  if ('Extra' in arg && typeof arg['Extra'] === 'string') column.extra = arg['Extra'];
  if ('Type' in arg && typeof arg['Type'] === 'string') {
    column.type = options.convertTypeFn(arg['Type']);
  }
  if ('Default' in arg) {
    column.defaultValue = typeof arg['Default'] === 'string' ? arg['Default'] : null;
  }
  return column;
};

/**
 * MySQLクエリから取得したカラムの型をTypescriptのprimitiveTypeに変換
 * @param {string} arg - MySQLクエリから取得したカラムの型
 * @return {PrimitiveTypeString | string} - TypescriptのprimitiveType(enumの場合は変換されない)
 */
export const convertToPrimitiveTypeString = (arg: string): PrimitiveTypeString | string => {
  const res = matchFn<string>(arg.toUpperCase())
    .with('TINYINT', () => PRIMITIVE_TYPE.NUMBER)
    .with('SMALLINT', () => PRIMITIVE_TYPE.NUMBER)
    .with('MEDIUMINT', () => PRIMITIVE_TYPE.NUMBER)
    .with('INT', () => PRIMITIVE_TYPE.NUMBER)
    .with('BIGINT', () => PRIMITIVE_TYPE.NUMBER)
    .with('FLOAT', () => PRIMITIVE_TYPE.NUMBER)
    .with('DOUBLE', () => PRIMITIVE_TYPE.NUMBER)
    .with('YEAR', () => PRIMITIVE_TYPE.NUMBER)
    .with('BIT', () => PRIMITIVE_TYPE.BOOLEAN)
    .with('DATE', () => PRIMITIVE_TYPE.DATE)
    .with('DATETIME', () => PRIMITIVE_TYPE.DATE)
    .with('TIMESTAMP', () => PRIMITIVE_TYPE.DATE)
    .with('CHAR', () => PRIMITIVE_TYPE.STRING)
    .with('VARCHAR', () => PRIMITIVE_TYPE.STRING)
    .with('DECIMAL', () => PRIMITIVE_TYPE.STRING)
    .with('NUMERIC', () => PRIMITIVE_TYPE.STRING)
    .with('TINYTEXT', () => PRIMITIVE_TYPE.STRING)
    .with('TEXT', () => PRIMITIVE_TYPE.STRING)
    .with('MEDIUMTEXT', () => PRIMITIVE_TYPE.STRING)
    .with('LONGTEXT', () => PRIMITIVE_TYPE.STRING)
    .with('ENUM', () => arg)
    .with('SET', () => PRIMITIVE_TYPE.STRING)
    .with('TIME', () => PRIMITIVE_TYPE.STRING)
    .with('BINARY', () => PRIMITIVE_TYPE.UNKNOWN)
    .with('VARBINARY', () => PRIMITIVE_TYPE.UNKNOWN)
    .with('TINYBLOB', () => PRIMITIVE_TYPE.UNKNOWN)
    .with('BLOB', () => PRIMITIVE_TYPE.UNKNOWN)
    .with('MEDIUMBLOB', () => PRIMITIVE_TYPE.UNKNOWN)
    .with('LONGBLOB', () => PRIMITIVE_TYPE.UNKNOWN)
    .otherwise(() => PRIMITIVE_TYPE.NULL)
    .execute();

  if (!res) return PRIMITIVE_TYPE.NULL;
  return res;
};
