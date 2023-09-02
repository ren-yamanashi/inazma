import { TableSchema } from './index';
import { ColumnSchema } from './parseColumn';

type ParseOptions = {
  toUpperCamelCase: (arg: string) => string;
  generateStringEnumAndColumnsFromSchema: GenerateStringEnumAndColumnsFromSchema;
};

type GenerateStringEnumAndColumnsFromSchema = {
  (columnsSchemas: ColumnSchema[], options: { toUpperCamelCase: (arg: string) => string }): {
    enums: string[];
    columns: string[];
  };
};

/**
 * TableSchemaの配列をもとに、文字列形式のschemaを生成
 * @param {TableSchema[]} tables
 * @param {ParseOptions} options
 * @returns {string} 文字列形式のschema
 */
export const generateStringFromSchema = (tables: TableSchema[], options: ParseOptions): string => {
  const schemaStringList: string[] = [];
  for (const table of tables) {
    const { enums, columns } = options.generateStringEnumAndColumnsFromSchema(table.columns, {
      toUpperCamelCase: options.toUpperCamelCase,
    });

    const tableName = options.toUpperCamelCase(table.name);
    const text = `${enums.join('\n')}\n\ntype ${tableName} = {\n${columns.join('\n')}\n};\n`;
    schemaStringList.push(text);
  }
  return schemaStringList.join('\n');
};

/**
 * ColumnSchemaの配列をもとに、文字列形式の、enumとcolumnの配列を生成する
 * @param {ColumnSchema[]} columnSchemas
 * @param {options: { toUpperCamelCase: (arg: string) => string }} options
 * @returns { enums: string[]; columns: string[] } 文字列形式の、enumとcolumnの配列
 */
export const generateStringEnumAndColumnsFromSchema = (
  columnSchemas: ColumnSchema[],
  options: { toUpperCamelCase: (arg: string) => string },
): { enums: string[]; columns: string[] } => {
  const PAREN_REGEXP = /(?<=\().*?(?=\))/;
  const ENUM_REGEXP = /enum/;
  const columns: string[] = [];
  const enums: string[] = [];

  for (const column of columnSchemas) {
    const columnField = column.field;
    const columnType = column.type;

    if (ENUM_REGEXP.test(columnType)) {
      const enumName = options.toUpperCamelCase(columnField);
      const enumFiled = String(columnType.match(PAREN_REGEXP)).replace(/'/g, '').split(',');
      enums.push(`enum ${enumName} {\n${enumFiled.join(',\n')}\n};`);
      columns.push(`${columnField}: ${enumName};`);
      continue;
    }
    columns.push(`${columnField}: ${columnType};`);
  }

  return {
    columns,
    enums,
  };
};
