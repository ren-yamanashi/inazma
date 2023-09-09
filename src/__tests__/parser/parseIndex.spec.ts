import { stringIndexDecoratorDummy } from '../../__mocks__/stringIndexDecorator.dummy';
import { stringSchemaDummy } from '../../__mocks__/stringSchema.dummy';
import { parseIndexDecoratorFromString, parseIndexes } from '../../parser/parseIndex';
import { IndexSchema } from '../../types/schema.type';

describe('parseIndex', () => {
  it('正常にparseされる', () => {
    // GIVEN: input(RowDataPacket[])
    const rowDataPackets = [
      {
        Table: 'sample',
        Non_unique: 0,
        Key_name: 'PRIMARY',
        Seq_in_index: 1,
        Column_name: 'id',
        Collation: 'A',
        Cardinality: 3,
        Sub_part: null,
        Packed: null,
        Null: '',
        Index_type: 'BTREE',
        Comment: '',
        Index_comment: '',
        Visible: 'YES',
        Expression: null,
      },
      {
        Table: 'sample',
        Non_unique: 1,
        Key_name: 'id_contents_idx',
        Seq_in_index: 1,
        Column_name: 'id',
        Collation: 'A',
        Cardinality: 3,
        Sub_part: null,
        Packed: null,
        Null: '',
        Index_type: 'BTREE',
        Comment: '',
        Index_comment: '',
        Visible: 'YES',
        Expression: null,
      },
      {
        Table: 'sample',
        Non_unique: 1,
        Key_name: 'id_contents_idx',
        Seq_in_index: 2,
        Column_name: 'content',
        Collation: 'A',
        Cardinality: 3,
        Sub_part: null,
        Packed: null,
        Null: 'YES',
        Index_type: 'BTREE',
        Comment: '',
        Index_comment: '',
        Visible: 'YES',
        Expression: null,
      },
    ];

    // GIVEN: output(IndexSchema)
    const expectedValue: IndexSchema[] = [
      {
        keyName: 'id_contents_idx',
        unique: false,
        columnNames: ['id', 'content'],
      },
    ];

    // WHEN
    const result = parseIndexes(rowDataPackets);

    // THEN
    expect(result).toEqual(expectedValue);
  });
});

describe('parseIndexDecoratorFromString', () => {
  it('正常に解析される(inputが@Indexデコレーターのみ)', () => {
    // GIVEN: input(string)
    const stringIndexDecorator = stringIndexDecoratorDummy;

    // GIVEN: output(IndexSchema[])
    const indexSchemas: IndexSchema[] = [
      {
        keyName: 'id_contents_idx',
        columnNames: ['id', 'content'],
        unique: false,
      },
      {
        keyName: 'unique_name_idx',
        columnNames: ['name'],
        unique: true,
      },
    ];

    // WHEN
    const result = parseIndexDecoratorFromString(stringIndexDecorator);

    // THEN
    expect(result).toEqual(indexSchemas);
  });

  it('正常に解析される(inputに@Indexデコレーター以外も含む)', () => {
    // GIVEN: input(string)
    const stringSchema = stringSchemaDummy;

    // GIVEN: output(IndexSchema[])
    const indexSchemas: IndexSchema[] = [
      {
        keyName: 'id_contents_idx',
        columnNames: ['id', 'content'],
        unique: false,
      },
    ];

    // WHEN
    const result = parseIndexDecoratorFromString(stringSchema);

    // THEN
    expect(result).toEqual(indexSchemas);
  });
});
