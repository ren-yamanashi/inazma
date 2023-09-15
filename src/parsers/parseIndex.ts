import { describe, expect, it } from 'vitest';
import { IndexSchema } from '../types/schema.type';

/**
 * クエリの出力結果を解析してIndexSchemaの形に変換
 * @param {{ [key: string]: unknown }[]}args - クエリの出力結果
 * @returns {IndexSchema[]}
 */
export const parseIndexes = (args: { [key: string]: unknown }[]): IndexSchema[] => {
  const KEY_NAME_PROPERTY = 'Key_name';
  const COLUMN_NAME_PROPERTY = 'Column_name';
  const NON_UNIQUE_PROPERTY = 'Non_unique';
  const KEY_NAME_PRIMARY = 'PRIMARY';
  const indexes: { [key: string]: IndexSchema } = {};

  for (const arg of args) {
    if (
      !(KEY_NAME_PROPERTY in arg) ||
      !(COLUMN_NAME_PROPERTY in arg) ||
      !(NON_UNIQUE_PROPERTY in arg) ||
      typeof arg[KEY_NAME_PROPERTY] !== 'string' ||
      typeof arg[COLUMN_NAME_PROPERTY] !== 'string' ||
      typeof arg[NON_UNIQUE_PROPERTY] !== 'number'
    ) {
      continue;
    }

    const keyName = arg[KEY_NAME_PROPERTY];
    const columnName = arg[COLUMN_NAME_PROPERTY];
    const nonUnique = arg[NON_UNIQUE_PROPERTY];

    if (keyName === KEY_NAME_PRIMARY || keyName === columnName) continue;

    if (!indexes[keyName]) {
      indexes[keyName] = {
        keyName: keyName,
        unique: nonUnique === 0,
        columnNames: [],
      };
    }

    if (!indexes[keyName].columnNames.includes(columnName)) {
      indexes[keyName].columnNames.push(columnName);
    }
  }

  return Object.values(indexes);
};

/**
 *
 * test
 *
 */
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
