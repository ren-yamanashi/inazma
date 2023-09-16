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
const generateStringEnumAndColumnsFromSchema = (
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
