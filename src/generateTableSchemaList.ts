import { MysqlClientInterface } from './interfaces/mysql.interface';
import { ParseOptions } from './parser/parseColumn';
import { showColumnsQuery } from './queries/showColumns.query';
import { showIndexQuery } from './queries/showIndex.query';
import { showTablesQuery } from './queries/showTables.query';
import { PrimitiveTypeString } from './types/primitive.type';
import { ColumnSchema, IndexSchema, TableSchema } from './types/schema.type';

type GenerateTableSchemaListOptions = {
  isArrayOfObjects: (arg: unknown) => arg is { [key: string]: unknown }[];
  parseIndexes: (args: { [key: string]: unknown }[]) => IndexSchema[];
  convertToErrorClass: (error: unknown) => Error;
  parseToPrimitiveTypeString: (arg: string) => PrimitiveTypeString | string;
  parseColumn: (arg: { [key: string]: unknown }, options: ParseOptions) => ColumnSchema;
};

export const generateTableSchemaList = async (
  mysqlClient: MysqlClientInterface,
  options: GenerateTableSchemaListOptions,
): Promise<TableSchema[] | Error> => {
  const tableSchemas: TableSchema[] = [];

  // NOTE: table一覧の取得
  const tables = await showTablesQuery(mysqlClient, options);
  if (tables instanceof Error) return new Error('parseError');

  for (const table of tables) {
    // NOTE: index一覧の取得
    const indexes = await showIndexQuery(table.tableName, mysqlClient, options);
    if (indexes instanceof Error) return new Error('parseError');

    // NOTE: column一覧の取得
    const columns = await showColumnsQuery(table.tableName, mysqlClient, options);
    if (columns instanceof Error) return new Error('parseError');

    tableSchemas.push({ database: table.databaseName, name: table.tableName, indexes, columns });
  }

  return tableSchemas;
};
