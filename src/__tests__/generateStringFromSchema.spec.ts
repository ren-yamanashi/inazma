import {
  columnIncludeEnumSchemasDummy,
  columnNotIncludeEnumSchemasDummy,
  columnSchemaDummy,
} from '../__mocks__/columnSchema.dummy';
import { tableSchemaDummy } from '../__mocks__/tableSchema.dummy';

import {
  convertColumnExtraToColumnDecorator,
  generateStringColumnDecorator,
  generateStringEnumAndColumnsFromSchema,
  generateStringFromSchema,
} from '../generateStringFromSchema';
import { toUpperCamelCase } from '../helpers/convert';
import { COLUMN_EXTRA, ColumnExtra } from '../types/column.type';
import { COLUMN_DECORATOR, ColumnDecorator } from '../types/decorator.type';
import { ColumnSchema, TableSchema } from '../types/schema.type';

describe('convertColumnExtraToColumnDecorator', () => {
  it('extraが`auto_increment`の場合', () => {
    // GIVEN: input(ColumnExtra)
    const extra: ColumnExtra = COLUMN_EXTRA.AUTO_INCREMENT;

    // GIVEN: output(ColumnDecorator)
    const decorator: ColumnDecorator = COLUMN_DECORATOR.AUTO_INCREMENT_COLUMN;

    // WHEN
    const result = convertColumnExtraToColumnDecorator(extra);

    // THEN
    expect(result).toEqual(decorator);
  });

  it('extraが`DEFAULT_GENERATED`の場合', () => {
    // GIVEN: input(ColumnExtra)
    const extra: ColumnExtra = COLUMN_EXTRA.DEFAULT_GENERATED;

    // GIVEN: output(ColumnDecorator)
    const decorator: ColumnDecorator = COLUMN_DECORATOR.DEFAULT_GENERATED_COLUMN;

    // WHEN
    const result = convertColumnExtraToColumnDecorator(extra);

    // THEN
    expect(result).toEqual(decorator);
  });

  it('extraが`VIRTUAL GENERATED`の場合', () => {
    // GIVEN: input(ColumnExtra)
    const extra: ColumnExtra = COLUMN_EXTRA.VIRTUAL_GENERATED;

    // GIVEN: output(ColumnDecorator)
    const decorator: ColumnDecorator = COLUMN_DECORATOR.VIRTUAL_GENERATED_COLUMN;

    // WHEN
    const result = convertColumnExtraToColumnDecorator(extra);

    // THEN
    expect(result).toEqual(decorator);
  });

  it('extraが`STORED GENERATED`の場合', () => {
    // GIVEN: input(ColumnExtra)
    const extra: ColumnExtra = COLUMN_EXTRA.STORED_GENERATED;

    // GIVEN: output(ColumnDecorator)
    const decorator: ColumnDecorator = COLUMN_DECORATOR.STORED_GENERATED_COLUMN;

    // WHEN
    const result = convertColumnExtraToColumnDecorator(extra);

    // THEN
    expect(result).toEqual(decorator);
  });

  it('extraが`on update CURRENT_TIMESTAMP`の場合', () => {
    // GIVEN: input(ColumnExtra)
    const extra: ColumnExtra = COLUMN_EXTRA.ON_UPDATE_CURRENT_TIMESTAMP;

    // GIVEN: output(ColumnDecorator)
    const decorator: ColumnDecorator = COLUMN_DECORATOR.ON_UPDATE_CURRENT_TIMESTAMP_COLUMN;

    // WHEN
    const result = convertColumnExtraToColumnDecorator(extra);

    // THEN
    expect(result).toEqual(decorator);
  });

  it('extraが空文字の場合', () => {
    // GIVEN: input(ColumnExtra)
    const extra: ColumnExtra = COLUMN_EXTRA.NONE;

    // GIVEN: output(ColumnDecorator)
    const decorator: ColumnDecorator = COLUMN_DECORATOR.COLUMN;

    // WHEN
    const result = convertColumnExtraToColumnDecorator(extra);

    // THEN
    expect(result).toEqual(decorator);
  });
});

describe('generateStringColumnDecorator', () => {
  it('正常に生成される', () => {
    // GIVEN: input(ColumnSchema)
    const columnSchema: ColumnSchema = columnSchemaDummy;

    // GIVEN: output(column)
    const column = `@AutoIncrementColumn({\ntype: \"bigint\",\ndefault: null,\nunsigned: true,\nunique: true,\nprimary: true\n})`;

    // WHEN
    const result = generateStringColumnDecorator(columnSchema, columnSchema.defaultValue, {
      convertColumnExtraToColumnDecorator: convertColumnExtraToColumnDecorator,
    });

    // THEN
    expect(result).toEqual(column);
  });
});

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
      generateStringColumnDecorator: generateStringColumnDecorator,
      convertColumnExtraToColumnDecorator: convertColumnExtraToColumnDecorator,
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
      generateStringColumnDecorator: generateStringColumnDecorator,
      convertColumnExtraToColumnDecorator: convertColumnExtraToColumnDecorator,
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
database: sample,
name: sample,
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
      generateStringColumnDecorator: generateStringColumnDecorator,
      convertColumnExtraToColumnDecorator: convertColumnExtraToColumnDecorator,
    });

    // THEN
    expect(result).toEqual(table);
  });
});
