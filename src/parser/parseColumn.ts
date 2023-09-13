import { matchFn } from '../helpers/match';
import { COLUMN_TYPE, ColumnExtra, ColumnKey, ColumnType } from '../types/column.type';
import { PRIMITIVE_TYPE, PrimitiveTypeString } from '../types/primitive.type';
import { ColumnSchema } from '../types/schema.type';

const defaultColumn: ColumnSchema = {
  field: '',
  typeInTs: '',
  typeInDb: '',
  nullable: false,
  unsigned: false,
  key: '',
  defaultValue: null,
  extra: '',
};

type ParseOptions = {
  convertTypeFn: (type: string) => PrimitiveTypeString | string;
};

export interface ParseColumn {
  (arg: { [key: string]: unknown }, options: ParseOptions): ColumnSchema;
}

/**
 * クエリから取得したテーブル列のスキーマ情報を解析して、厳密に型指定されたColumnSchemaオブジェクトを生成
 * @param {object} arg - MySQLクエリから取得したテーブル列のスキーマ
 * @returns {ColumnSchema} - 厳密に型指定されたTableSchemaオブジェクト
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
  if ('Extra' in arg && typeof arg['Extra'] === 'string') {
    column.extra = arg['Extra'] as ColumnExtra;
  }
  if ('Type' in arg && typeof arg['Type'] === 'string') {
    column.typeInTs = options.convertTypeFn(arg['Type']);
    column.typeInDb = parseToColumnType(new String(arg['Type']).replace(/unsigned/g, '').trim());
    column.unsigned = /unsigned/.test(arg['Type']);
  }
  if ('Default' in arg) {
    const defaultValue = typeof arg['Default'] === 'string' ? arg['Default'] : null;
    column.defaultValue = defaultValue === 'CURRENT_TIMESTAMP' ? 'NOW()' : defaultValue;
  }
  return column;
};

/**
 * MySQLクエリから取得したカラムの型をTypescriptのprimitiveTypeに変換
 * @param {string} arg - MySQLクエリから取得したカラムの型
 * @return {PrimitiveTypeString | string} - TypescriptのprimitiveType(enumの場合は変換されない)
 */
export const parseToPrimitiveTypeString = (arg: string): PrimitiveTypeString | string => {
  const res = matchFn<string>(arg.toUpperCase())
    .with('INT', () => PRIMITIVE_TYPE.NUMBER)
    .with('TINYINT', () => PRIMITIVE_TYPE.NUMBER)
    .with('INTEGER', () => PRIMITIVE_TYPE.NUMBER)
    .with('SMALLINT', () => PRIMITIVE_TYPE.NUMBER)
    .with('MEDIUMINT', () => PRIMITIVE_TYPE.NUMBER)
    .with('BIGINT', () => PRIMITIVE_TYPE.NUMBER)
    .with('FLOAT', () => PRIMITIVE_TYPE.NUMBER)
    .with('DOUBLE', () => PRIMITIVE_TYPE.NUMBER)
    .with('YEAR', () => PRIMITIVE_TYPE.NUMBER)
    .with('BIT', () => PRIMITIVE_TYPE.BIGINT)
    .with('TINYINT(1)', () => PRIMITIVE_TYPE.BOOLEAN)
    .with('BOOLEAN', () => PRIMITIVE_TYPE.BOOLEAN)
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
    .with('TIME', () => PRIMITIVE_TYPE.STRING)
    // TODO: setはunion型にするので、`() => arg`で良いか検証
    .with('SET', () => PRIMITIVE_TYPE.STRING)
    .with('ENUM', () => arg)
    .otherwise(() => PRIMITIVE_TYPE.NULL)
    .execute();

  if (!res) return PRIMITIVE_TYPE.NULL;
  return res;
};

export const parseToColumnType = (arg: string): ColumnType => {
  const upperArg = arg.toUpperCase();

  // NOTE: varcharの文字列を解析
  const varcharMatch = arg.match(/^varchar\((.+?)\)$/);
  if (varcharMatch) return `varchar(${varcharMatch[1]})` as ColumnType;

  // NOTE: bigintの文字列を解析
  const bigintMatch = arg.match(/^bigint\((.+?)\)$/);
  if (bigintMatch) return `bigint(${bigintMatch[1]})` as ColumnType;

  // NOTE: intの文字列を解析
  const intMatch = arg.match(/^int\((.+?)\)$/);
  if (intMatch) return `int(${intMatch[1]})` as ColumnType;

  // NOTE: enumの文字列を解析
  const enumMatch = arg.match(/^enum\((.+?)\)$/);
  if (enumMatch) return `enum(${enumMatch[1]})` as ColumnType;

  // NOTE: その他の型を確認
  if (upperArg in COLUMN_TYPE) return COLUMN_TYPE[upperArg as keyof typeof COLUMN_TYPE];

  throw new Error('Invalid column type');
};
