import { MysqlClientInterface } from '../interfaces/mysql.interface';

type DropTablesQueryOptions = {
  convertToErrorClass: (error: unknown) => Error;
};

export const dropTablesQuery = async (
  tableNameList: string[],
  mysqlClient: MysqlClientInterface,
  options: DropTablesQueryOptions,
): Promise<void | Error> => {
  try {
    await Promise.all(
      tableNameList.map(async (tableName) => mysqlClient.queryAsync('DROP TABLE ??', [tableName])),
    );
  } catch (error) {
    console.error(error);
    return options.convertToErrorClass(error);
  }
};
