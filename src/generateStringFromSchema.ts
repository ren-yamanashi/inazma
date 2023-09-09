import { COLUMN_EXTRA, COLUMN_KEY, ColumnExtra } from './types/column.type';
import { COLUMN_DECORATOR, ColumnDecorator } from './types/decorator.type';
import { ColumnSchema, TableSchema } from './types/schema.type';

type GenerateStringFromSchemaOptions = {
  toUpperCamelCase: (arg: string) => string;
  generateStringEnumAndColumnsFromSchema: GenerateStringEnumAndColumnsFromSchema;
  generateStringColumnDecorator: GenerateStringColumnDecorator;
  convertColumnExtraToColumnDecorator: ConvertColumnExtraToColumnDecorator;
};

type GenerateStringEnumAndColumnsFromSchemaOptions = {
  toUpperCamelCase: (arg: string) => string;
  generateStringColumnDecorator: GenerateStringColumnDecorator;
  convertColumnExtraToColumnDecorator: ConvertColumnExtraToColumnDecorator;
};

type GenerateStringColumnDecoratorOptions = {
  convertColumnExtraToColumnDecorator: ConvertColumnExtraToColumnDecorator;
};

interface ConvertColumnExtraToColumnDecorator {
  (extra: ColumnExtra): ColumnDecorator;
}

interface GenerateStringColumnDecorator {
  (
    column: ColumnSchema,
    defaultValue: string | null,
    options: GenerateStringColumnDecoratorOptions,
  ): string;
}

interface GenerateStringEnumAndColumnsFromSchema {
  (columnsSchemas: ColumnSchema[], options: GenerateStringEnumAndColumnsFromSchemaOptions): {
    enums: string[];
    columns: string[];
  };
}

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
      convertColumnExtraToColumnDecorator: options.convertColumnExtraToColumnDecorator,
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
database: ${table.database},
name: ${table.name},
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

/**
 * ColumnSchemaをもとに文字列形式の `@Column` デコレータを生成する
 * @param {ColumnSchema} column
 * @param {string} defaultValue - カラムの初期値
 * @returns {string} 文字列形式の `@Column` デコレータ
 */
export const generateStringColumnDecorator: GenerateStringColumnDecorator = (
  column: ColumnSchema,
  defaultValue: string | null,
  options: GenerateStringColumnDecoratorOptions,
): string => {
  const isUnique = [COLUMN_KEY.UNI, COLUMN_KEY.PRI].some((item) => item === column.key);
  const isPrimary = column.key === COLUMN_KEY.PRI;
  const decorator = options.convertColumnExtraToColumnDecorator(column.extra);
  const columnDecorator = `${decorator}({
type: "${column.typeInDb}",
default: ${defaultValue},
unsigned: ${column.unsigned},
unique: ${isUnique},
primary: ${isPrimary}
})`;

  return columnDecorator;
};

/**
 * ColumnExtraをColumnDecoratorに変換
 * @param {ColumnExtra} extra
 * @returns {ColumnDecorator}
 */
export const convertColumnExtraToColumnDecorator: ConvertColumnExtraToColumnDecorator = (
  extra: ColumnExtra,
): ColumnDecorator => {
  switch (extra) {
    case COLUMN_EXTRA.AUTO_INCREMENT: {
      return COLUMN_DECORATOR.AUTO_INCREMENT_COLUMN;
    }
    case COLUMN_EXTRA.DEFAULT_GENERATED: {
      return COLUMN_DECORATOR.DEFAULT_GENERATED_COLUMN;
    }
    case COLUMN_EXTRA.NONE: {
      return COLUMN_DECORATOR.COLUMN;
    }
    case COLUMN_EXTRA.ON_UPDATE_CURRENT_TIMESTAMP: {
      return COLUMN_DECORATOR.ON_UPDATE_CURRENT_TIMESTAMP_COLUMN;
    }
    case COLUMN_EXTRA.STORED_GENERATED: {
      return COLUMN_DECORATOR.STORED_GENERATED_COLUMN;
    }
    case COLUMN_EXTRA.VIRTUAL_GENERATED: {
      return COLUMN_DECORATOR.VIRTUAL_GENERATED_COLUMN;
    }
    default: {
      return COLUMN_DECORATOR.COLUMN;
    }
  }
};
