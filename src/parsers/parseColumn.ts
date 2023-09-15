import { describe, expect, it } from 'vitest';
import { matchFn } from '../helpers/match';
import { COLUMN_KEY, COLUMN_TYPE, ColumnExtra, ColumnKey, ColumnType } from '../types/column.type';
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

/**
 * クエリから取得したテーブル列のスキーマ情報を解析して、厳密に型指定されたColumnSchemaオブジェクトを生成
 * @param {object} arg - MySQLクエリから取得したテーブル列のスキーマ
 * @returns {ColumnSchema} - 厳密に型指定されたTableSchemaオブジェクト
 */
export const parseColumn = (arg: { [key: string]: unknown }): ColumnSchema => {
  // NOTE: オブジェクトの参照を毎回生成する
  const column = Object.assign({}, defaultColumn);
  if ('Field' in arg && typeof arg['Field'] === 'string') column.field = arg['Field'];
  if ('Null' in arg) column.nullable = arg['Null'] === 'YES';
  if ('Key' in arg && typeof arg['Key'] === 'string') column.key = arg['Key'] as ColumnKey;
  if ('Extra' in arg && typeof arg['Extra'] === 'string') {
    column.extra = arg['Extra'] as ColumnExtra;
  }
  if ('Type' in arg && typeof arg['Type'] === 'string') {
    column.typeInTs = parseToPrimitiveTypeString(arg['Type']);
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
const parseToPrimitiveTypeString = (arg: string): PrimitiveTypeString | string => {
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

/**
 * 文字列をMySQLのカラムの型に変換
 * @param {string}arg
 * @returns {ColumnType} Mysqlのカラムの型
 */
const parseToColumnType = (arg: string): ColumnType => {
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

/**
 *
 * test
 *
 */
describe('parseColumn', () => {
  it('正常にparsesされる', () => {
    // GIVEN: input (RowDataPacket)
    const rowDataPacket = {
      Field: 'id',
      Type: 'bigint unsigned',
      Null: 'NO',
      Key: 'PRI',
      Default: null,
      Extra: 'auto_increment',
    };

    // GIVEN: output (ColumnSchema)
    const expectedValue: ColumnSchema = {
      field: 'id',
      typeInDb: 'bigint',
      typeInTs: 'number',
      nullable: false,
      key: COLUMN_KEY.PRI,
      unsigned: true,
      defaultValue: null,
      extra: 'auto_increment',
    };

    // WHEN
    const result = parseColumn(rowDataPacket);

    // THEN
    expect(result).toEqual(expectedValue);
  });

  it('Typeがenumの場合は、convertされない', () => {
    // GIVEN: input (RowDataPacket)
    const rowDataPacket = {
      Field: 'status',
      Type: "enum('active','inactive','deleted')",
      Null: 'NO',
      Key: 'PRI',
      Default: null,
      Extra: 'auto_increment',
    };

    // GIVEN: output (TableSchema)
    const expectedValue: ColumnSchema = {
      field: 'status',
      typeInDb: "enum('active','inactive','deleted')",
      typeInTs: "enum('active','inactive','deleted')",
      nullable: false,
      key: COLUMN_KEY.PRI,
      unsigned: false,
      defaultValue: null,
      extra: 'auto_increment',
    };

    // WHEN
    const result = parseColumn(rowDataPacket);

    // THEN
    expect(result).toEqual(expectedValue);
  });
});

describe('parseToColumnType', () => {
  it('正常にparseされる', () => {
    // GIVEN: input, output(int)
    const intString = 'int';

    // WHEN
    const result = parseToColumnType(intString);

    // THEN
    expect(result).toEqual(intString);
  });

  it('varcharやenumなど括弧の間が任意の文字になるtypeもparseされる', () => {
    // GIVEN: input, output(varchar)
    const varcharString = 'varchar(255)';

    // GIVEN: input, output(enum)
    const enumString = 'enum("A","B","C")';

    // WHEN
    const resultOfParseVarcharString = parseToColumnType(varcharString);
    const resultOfParseEnumString = parseToColumnType(enumString);

    // THEN
    expect(resultOfParseVarcharString).toEqual(varcharString);
    expect(resultOfParseEnumString).toEqual(enumString);
  });

  it('一致するColumnTypeがない場合はエラー', () => {
    // GIVEN: input(一致するColumnTypeがない)
    const invalidInput = 'invalidType';

    // WHEN
    // THEN
    expect(() => parseToColumnType(invalidInput)).toThrow('Invalid column type');
  });
});
