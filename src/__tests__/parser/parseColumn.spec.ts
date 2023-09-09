import {
  parseColumn,
  parseToColumnType,
  parseToPrimitiveTypeString,
} from '../../parser/parseColumn';
import { COLUMN_KEY } from '../../types/column.type';
import { ColumnSchema } from '../../types/schema.type';

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
    const result = parseColumn(rowDataPacket, { convertTypeFn: parseToPrimitiveTypeString });

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
    const result = parseColumn(rowDataPacket, { convertTypeFn: parseToPrimitiveTypeString });

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
