/* eslint-disable no-useless-escape */
import { describe, expect, it } from 'vitest';
import {
  columnIncludeEnumSchemasDummy,
  columnNotIncludeEnumSchemasDummy,
} from '../__mocks__/columnSchema.dummy';
import { tableSchemaDummy } from '../__mocks__/tableSchema.dummy';
import { toUpperCamelCase } from '../helpers/convert';
import { ColumnSchema, TableSchema } from '../types/schema.type';

/**
 * TableSchemaの配列をもとに、文字列形式のschemaを生成
 * @param {TableSchema[]} tables
 * @param {GenerateStringFromSchemaOptions} options
 * @returns {string} 文字列形式のschema
 */
export const generateStringFromSchema = (tables: TableSchema[]): string => {
  const schemaStringList: string[] = [];

  for (const table of tables) {
    const { enums, columns } = generateStringEnumAndColumnsFromSchema(table.columns);

    const tableName = toUpperCamelCase(table.name);

    const indexes = table.indexes.map(
      ({ keyName, columnNames, unique }) =>
        `{
keyName: '${keyName}',
unique: ${unique},
columnNames: ["${columnNames.join('", "')}"]
}`,
    );

    const schemaString = `${enums.join('\n')}\n
const ${tableName}: TableSchema = {
database: '${table.database}',
name: '${table.name}',
columns: [${columns.join(',\n')}] as ColumnSchema[],
indexes: [${indexes.join(',\n')}] as IndexSchema[]
}`;

    schemaStringList.push(schemaString);
  }

  return schemaStringList.join('\n');
};

/**
 * ColumnSchemaの配列をもとに、文字列形式の、enumとcolumnの配列を生成する
 * @param {ColumnSchema[]} columnSchemas
 * @param {GenerateStringEnumAndColumnsFromSchemaOptions} options
 * @returns { enums: string[]; columns: string[] } 文字列形式の、enumとcolumnの配列
 */
export const generateStringEnumAndColumnsFromSchema = (
  columnSchemas: ColumnSchema[],
): { enums: string[]; columns: string[] } => {
  const PAREN_REGEXP = /(?<=\().*?(?=\))/;
  const ENUM_REGEXP = /enum/;
  const columns: string[] = [];
  const enums: string[] = [];

  for (const column of columnSchemas) {
    const columnField = column.field;
    const columnTypeInTs = column.typeInTs;
    const enumName = toUpperCamelCase(columnField);

    const isEnumType = ENUM_REGEXP.test(columnTypeInTs);

    const defaultValue = isEnumType ? `${enumName}.${column.defaultValue}` : column.defaultValue;
    const enumFiled = isEnumType
      ? String(columnTypeInTs.match(PAREN_REGEXP)).replace(/'/g, '').split(',')
      : null;

    // NOTE: enumを作成
    enumFiled && enums.push(`enum ${enumName} {\n${enumFiled.join(',\n')}\n};`);

    // NOTE: columnを作成
    columns.push(`{
field: '${columnField}',
typeInTs: ${enumFiled ? `"${columnTypeInTs}"` : `'${column.typeInTs}'`},
typeInDb: ${enumFiled ? `"${column.typeInDb}"` : `'${column.typeInDb}'`},
unsigned: ${column.unsigned},
nullable: ${column.nullable},
key: '${column.key}',
defaultValue: ${defaultValue != null ? `'${defaultValue}'` : null},
extra: '${column.extra}'
}`);
  }

  return {
    columns,
    enums,
  };
};

/**
 *
 * test
 *
 */
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
    const result = generateStringEnumAndColumnsFromSchema(columnSchemas);

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
    const result = generateStringEnumAndColumnsFromSchema(columnSchemas);

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
    const result = generateStringFromSchema([tableSchema]);

    // THEN
    expect(result).toEqual(table);
  });
});
