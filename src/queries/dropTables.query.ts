import { MysqlClientInterface } from '../interfaces/mysql.interface';

export const dropTablesQuery = async (
  tableNameList: string[],
  mysqlClient: MysqlClientInterface,
): Promise<void | Error> => {
  try {
    await Promise.all(
      tableNameList.map(async (tableName) => mysqlClient.queryAsync('DROP TABLE ??', [tableName])),
    );
  } catch (error) {
    console.error(error);
    return new Error('queryError');
  }
};
