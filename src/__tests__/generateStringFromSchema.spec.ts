import { generateStringEnumAndColumnsFromSchema } from '../generateStringFromSchema';
import { ColumnSchema } from '../parseColumn';
import { toUpperCamelCase } from '../helpers/convertString';

describe('generateStringEnumAndColumnsFromSchema', () => {
  it('enumとcolumnが正常に生成される', () => {
    // GIVEN: input(ColumnSchema)
    const columnSchemas: ColumnSchema[] = [
      {
        field: 'id',
        type: 'number',
        nullable: false,
        key: 'PRI',
        defaultValue: null,
        extra: 'auto_increment',
      },
      {
        field: 'content',
        type: 'string',
        nullable: true,
        key: '',
        defaultValue: null,
        extra: '',
      },
      {
        field: 'order',
        type: 'number',
        nullable: false,
        key: '',
        defaultValue: '0',
        extra: '',
      },
      {
        field: 'status',
        type: "enum('active','inactive','deleted')",
        nullable: false,
        key: '',
        defaultValue: 'active',
        extra: '',
      },
      {
        field: 'createdDate',
        type: 'Date',
        nullable: false,
        key: '',
        defaultValue: 'CURRENT_TIMESTAMP',
        extra: 'DEFAULT_GENERATED',
      },
    ];

    // GIVEN: output(columns)
    const columns = [
      'id: number;',
      'content: string;',
      'order: number;',
      'status: Status;',
      'createdDate: Date;',
    ];

    // GIVEN: output(enums)
    const enums = [
      `enum Status {
active
inactive
deleted
};`,
    ];

    // WHEN
    const result = generateStringEnumAndColumnsFromSchema(columnSchemas, {
      toUpperCamelCase: toUpperCamelCase,
    });

    // THEN
    expect(result).toEqual({ columns, enums });
  });

  it('columnが正常に生成される', () => {
    // GIVEN: input(ColumnSchema)
    const columnSchemas: ColumnSchema[] = [
      {
        field: 'id',
        type: 'number',
        nullable: false,
        key: 'PRI',
        defaultValue: null,
        extra: 'auto_increment',
      },
      {
        field: 'content',
        type: 'string',
        nullable: true,
        key: '',
        defaultValue: null,
        extra: '',
      },
      {
        field: 'order',
        type: 'number',
        nullable: false,
        key: '',
        defaultValue: '0',
        extra: '',
      },
      {
        field: 'createdDate',
        type: 'Date',
        nullable: false,
        key: '',
        defaultValue: 'CURRENT_TIMESTAMP',
        extra: 'DEFAULT_GENERATED',
      },
    ];

    // GIVEN: output(columns)
    const columns = ['id: number;', 'content: string;', 'order: number;', 'createdDate: Date;'];

    // WHEN
    const result = generateStringEnumAndColumnsFromSchema(columnSchemas, {
      toUpperCamelCase: toUpperCamelCase,
    });

    // THEN
    expect(result).toEqual({ columns, enums: [] });
  });
});
