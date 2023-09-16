import { ColumnSchema, TableSchema } from './types/schema.type';

type GenerateStringFromSchemaOptions = {
  toUpperCamelCase: (arg: string) => string;
  generateStringEnumAndColumnsFromSchema: GenerateStringEnumAndColumnsFromSchema;
};

type GenerateStringFromSchema = {
  (tables: TableSchema[], options: GenerateStringFromSchemaOptions): string;
};

/**
 * TableSchemaの配列をもとに、文字列形式のschemaを生成
 * @param {TableSchema[]} tables
 * @param {GenerateStringFromSchemaOptions} options
 * @returns {string} 文字列形式のschema
 */
export const generateStringFromSchema: GenerateStringFromSchema = (
  tables: TableSchema[],
  options: GenerateStringFromSchemaOptions,
): string => {
  const schemaStringList: string[] = [];

  for (const table of tables) {
    const { enums, columns } = options.generateStringEnumAndColumnsFromSchema(table.columns, {
      toUpperCamelCase: options.toUpperCamelCase,
    });

    const tableName = options.toUpperCamelCase(table.name);

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

type GenerateStringEnumAndColumnsFromSchemaOptions = {
  toUpperCamelCase: (arg: string) => string;
};

type GenerateStringEnumAndColumnsFromSchema = {
  (columnsSchemas: ColumnSchema[], options: GenerateStringEnumAndColumnsFromSchemaOptions): {
    enums: string[];
    columns: string[];
  };
};

/**
 * ColumnSchemaの配列をもとに、文字列形式の、enumとcolumnの配列を生成する
 * @param {ColumnSchema[]} columnSchemas
 * @param {GenerateStringEnumAndColumnsFromSchemaOptions} options
 * @returns { enums: string[]; columns: string[] } 文字列形式の、enumとcolumnの配列
 */
export const generateStringEnumAndColumnsFromSchema: GenerateStringEnumAndColumnsFromSchema = (
  columnSchemas: ColumnSchema[],
  options: GenerateStringEnumAndColumnsFromSchemaOptions,
): { enums: string[]; columns: string[] } => {
  const PAREN_REGEXP = /(?<=\().*?(?=\))/;
  const ENUM_REGEXP = /enum/;
  const columns: string[] = [];
  const enums: string[] = [];

  for (const column of columnSchemas) {
    const columnField = column.field;
    const columnTypeInTs = column.typeInTs;
    const enumName = options.toUpperCamelCase(columnField);

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
