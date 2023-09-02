import {
  COLUMN_KEY,
  ColumnSchema,
  convertToPrimitiveTypeString,
  parseColumn,
} from '../parseColumn';

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
      type: 'number',
      nullable: false,
      key: COLUMN_KEY.PRI,
      defaultValue: null,
      extra: 'auto_increment',
    };

    // WHEN
    const result = parseColumn(rowDataPacket, { convertTypeFn: convertToPrimitiveTypeString });

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
      type: "enum('active','inactive','deleted')",
      nullable: false,
      key: COLUMN_KEY.PRI,
      defaultValue: null,
      extra: 'auto_increment',
    };

    // WHEN
    const result = parseColumn(rowDataPacket, { convertTypeFn: convertToPrimitiveTypeString });

    // THEN
    expect(result).toEqual(expectedValue);
  });
});
