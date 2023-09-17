import { MysqlClientInterface } from '../interfaces/mysql.interface';
import { showColumnsQuery } from '../queries/showColumns.query';
import { showIndexQuery } from '../queries/showIndex.query';
import { showTablesQuery } from '../queries/showTables.query';
import { TableSchema } from '../types/schema.type';

export const generateTableSchemaList = async (
  mysqlClient: MysqlClientInterface,
): Promise<TableSchema[] | Error> => {
  const tableSchemas: TableSchema[] = [];

  // NOTE: table一覧の取得
  const tables = await showTablesQuery(mysqlClient);
  if (tables instanceof Error) return new Error('parseError');

  for (const table of tables) {
    // NOTE: index一覧の取得
    const indexes = await showIndexQuery(table.tableName, mysqlClient);
    if (indexes instanceof Error) return new Error('parseError');

    // NOTE: column一覧の取得
    const columns = await showColumnsQuery(table.tableName, mysqlClient);
    if (columns instanceof Error) return new Error('parseError');

    tableSchemas.push({ database: table.databaseName, name: table.tableName, indexes, columns });
  }

  return tableSchemas;
};
