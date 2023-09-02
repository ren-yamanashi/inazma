import {
  generateStringEnumAndColumnsFromSchema,
  generateStringFromSchema,
} from '../generateStringFromSchema';
import { ColumnSchema } from '../parseColumn';
import { toUpperCamelCase } from '../helpers/convertString';
import {
  columnIncludeEnumSchemasDummy,
  columnNotIncludeEnumSchemasDummy,
} from '../__mocks__/columnSchema.dummy';
import { TableSchema } from '../index';
import { tableSchemaDummy } from '../__mocks__/tableSchema.dummy';
import exp from 'constants';

describe('generateStringEnumAndColumnsFromSchema', () => {
  it('enumとcolumnが正常に生成される', () => {
    // GIVEN: input(ColumnSchema[])
    const columnSchemas: ColumnSchema[] = columnIncludeEnumSchemasDummy;

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
active,
inactive,
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
    // GIVEN: input(ColumnSchema[])
    const columnSchemas: ColumnSchema[] = columnNotIncludeEnumSchemasDummy;

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

describe('generateStringFromSchema', () => {
  it('schemaが正常に生成される', () => {
    // GIVEN: input(TableSchema)
    const tableSchema: TableSchema = tableSchemaDummy;

    // GIVEN: output(table)
    const table = `enum Status {
active,
inactive,
deleted
};

type Sample = {
id: number;
content: string;
order: number;
status: Status;
createdDate: Date;
};
`;

    // WHEN
    const result = generateStringFromSchema([tableSchema], {
      toUpperCamelCase: toUpperCamelCase,
      generateStringEnumAndColumnsFromSchema: generateStringEnumAndColumnsFromSchema,
    });

    // THEN
    expect(result).toEqual(table);
  });
});
