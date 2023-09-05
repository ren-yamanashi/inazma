import { parseIndexes } from '../parseIndex';
import { IndexSchema } from '../types/schema.type';

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
