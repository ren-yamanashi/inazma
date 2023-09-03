import { TableSchema } from './index';
import { COLUMN_KEY, ColumnSchema } from './parseColumn';

type GenerateStringFromSchemaOptions = {
  toUpperCamelCase: (arg: string) => string;
  generateStringEnumAndColumnsFromSchema: GenerateStringEnumAndColumnsFromSchema;
  generateStringColumnDecorator: (column: ColumnSchema, defaultValue?: string) => string;
};

type GenerateStringEnumAndColumnsFromSchemaOptions = {
  toUpperCamelCase: (arg: string) => string;
  generateStringColumnDecorator: (column: ColumnSchema, defaultValue?: string) => string;
};

type GenerateStringEnumAndColumnsFromSchema = {
  (columnsSchemas: ColumnSchema[], options: GenerateStringEnumAndColumnsFromSchemaOptions): {
    enums: string[];
    columns: string[];
  };
};

/**
 * TableSchemaの配列をもとに、文字列形式のschemaを生成
 * @param {TableSchema[]} tables
 * @param {GenerateStringFromSchemaOptions} options
 * @returns {string} 文字列形式のschema
 */
export const generateStringFromSchema = (
  tables: TableSchema[],
  options: GenerateStringFromSchemaOptions,
): string => {
  const schemaStringList: string[] = [];

  for (const table of tables) {
    const { enums, columns } = options.generateStringEnumAndColumnsFromSchema(table.columns, {
      toUpperCamelCase: options.toUpperCamelCase,
      generateStringColumnDecorator: options.generateStringColumnDecorator,
    });

    const tableName = options.toUpperCamelCase(table.name);
    const text = `${enums.join('\n')}\n\nclass ${tableName} {\n${columns.join('\n')}\n};\n`;
    schemaStringList.push(text);
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
  options: GenerateStringEnumAndColumnsFromSchemaOptions,
): { enums: string[]; columns: string[] } => {
  const PAREN_REGEXP = /(?<=\().*?(?=\))/;
  const ENUM_REGEXP = /enum/;
  const columns: string[] = [];
  const enums: string[] = [];

  for (const column of columnSchemas) {
    const columnField = column.field;
    const columnType = column.typeInTs;

    if (ENUM_REGEXP.test(columnType)) {
      const enumName = options.toUpperCamelCase(columnField);
      const enumFiled = String(columnType.match(PAREN_REGEXP)).replace(/'/g, '').split(',');
      const columnDecorator = options.generateStringColumnDecorator(
        column,
        `${enumName}.${column.defaultValue}`,
      );
      enums.push(`enum ${enumName} {\n${enumFiled.join(',\n')}\n};`);
      columns.push(`${columnDecorator}\n${columnField}: ${enumName};\n`);
      continue;
    }

    const columnDecorator = options.generateStringColumnDecorator(column);
    columns.push(
      `${columnDecorator}\n${columnField}: ${columnType}${column.nullable ? ' | null' : ''};\n`,
    );
  }

  return {
    columns,
    enums,
  };
};

/**
 * ColumnSchemaをもとに文字列形式の `@Column` デコレータを生成する
 * @param {ColumnSchema} column
 * @param {string} defaultValue - カラムの初期値
 * @returns {string} 文字列形式の `@Column` デコレータ
 */
export const generateStringColumnDecorator = (
  column: ColumnSchema,
  defaultValue?: string,
): string => {
  const isUnique = [COLUMN_KEY.UNI, COLUMN_KEY.PRI].some((item) => item === column.key);
  const isPrimary = column.key === COLUMN_KEY.PRI;
  const _defaultValue = defaultValue ?? column.defaultValue;
  const columnDecorator = `@Column({
type: "${column.typeInDb}",
default: ${_defaultValue},
unsigned: ${column.unsigned},
unique: ${isUnique},
primary: ${isPrimary}
})`;

  return columnDecorator;
};
