import { describe, expect, it } from 'vitest';
import {
  columnIncludeEnumSchemasDummy,
  columnNotIncludeEnumSchemasDummy,
} from '../../__mocks__/columnSchema.dummy';
import { tableSchemaDummy } from '../../__mocks__/tableSchema.dummy';

import {
  generateStringEnumAndColumnsFromSchema,
  generateStringFromSchema,
} from '../../generators/generateStringFromSchema';
import { toUpperCamelCase } from '../../helpers/convert';
import { ColumnSchema, TableSchema } from '../../types/schema.type';

describe('generateStringEnumAndColumnsFromSchema', () => {
  it('enumとcolumnが正常に生成される', () => {
    // GIVEN: input(ColumnSchema[])
    const columnSchemas: ColumnSchema[] = columnIncludeEnumSchemasDummy;

    // GIVEN: output(columns)
    const columns = [
      `{
field: 'id',
typeInTs: 'number',
typeInDb: 'bigint',
unsigned: true,
nullable: false,
key: 'PRI',
defaultValue: null,
extra: 'auto_increment'
}`,
      `{
field: 'content',
typeInTs: 'string',
typeInDb: 'varchar(255)',
unsigned: false,
nullable: true,
key: '',
defaultValue: null,
extra: ''
}`,
      `{
field: 'order',
typeInTs: 'number',
typeInDb: 'int',
unsigned: true,
nullable: false,
key: '',
defaultValue: '0',
extra: ''
}`,
      `{
field: 'status',
typeInTs: "enum('active','inactive','deleted')",
typeInDb: "enum('active','inactive','deleted')",
unsigned: false,
nullable: false,
key: '',
defaultValue: 'Status.active',
extra: ''
}`,
      `{
field: 'createdDate',
typeInTs: 'Date',
typeInDb: 'datetime',
unsigned: false,
nullable: false,
key: '',
defaultValue: 'NOW()',
extra: 'DEFAULT_GENERATED'
}`,
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
    const columns = [
      `{
field: 'id',
typeInTs: 'number',
typeInDb: 'bigint',
unsigned: true,
nullable: false,
key: 'PRI',
defaultValue: null,
extra: 'auto_increment'
}`,
      `{
field: 'content',
typeInTs: 'string',
typeInDb: 'varchar(255)',
unsigned: false,
nullable: true,
key: '',
defaultValue: null,
extra: ''
}`,
      `{
field: 'order',
typeInTs: 'number',
typeInDb: 'int',
unsigned: true,
nullable: false,
key: '',
defaultValue: '0',
extra: ''
}`,
      `{
field: 'createdDate',
typeInTs: 'Date',
typeInDb: 'datetime',
unsigned: false,
nullable: false,
key: '',
defaultValue: 'NOW()',
extra: 'DEFAULT_GENERATED'
}`,
    ];

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

const Sample: TableSchema = {
database: 'sample',
name: 'sample',
columns: [{
field: 'id',
typeInTs: 'number',
typeInDb: 'bigint',
unsigned: true,
nullable: false,
key: 'PRI',
defaultValue: null,
extra: 'auto_increment'
},
{
field: 'content',
typeInTs: 'string',
typeInDb: 'varchar(255)',
unsigned: false,
nullable: true,
key: '',
defaultValue: null,
extra: ''
},
{
field: 'order',
typeInTs: 'number',
typeInDb: 'int',
unsigned: true,
nullable: false,
key: '',
defaultValue: '0',
extra: ''
},
{
field: 'status',
typeInTs: \"enum('active','inactive','deleted')\",
typeInDb: \"enum('active','inactive','deleted')\",
unsigned: false,
nullable: false,
key: '',
defaultValue: 'Status.active',
extra: ''
},
{
field: 'createdDate',
typeInTs: 'Date',
typeInDb: 'datetime',
unsigned: false,
nullable: false,
key: '',
defaultValue: 'NOW()',
extra: 'DEFAULT_GENERATED'
}] as ColumnSchema[],
indexes: [{
keyName: 'id_contents_idx',
unique: false,
columnNames: [\"id\", \"content\"]
}] as IndexSchema[]
}`;

    // WHEN
    const result = generateStringFromSchema([tableSchema], {
      toUpperCamelCase: toUpperCamelCase,
      generateStringEnumAndColumnsFromSchema: generateStringEnumAndColumnsFromSchema,
    });

    // THEN
    expect(result).toEqual(table);
  });
});
