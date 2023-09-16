import { safeExecuteOfPromise } from '../helpers/safeExecute';
import { MysqlClientInterface } from '../interfaces/mysql.interface';

export const dropTablesQuery = async (
  tableName: string,
  mysqlClient: MysqlClientInterface,
): Promise<void | Error> => {
  const { error } = await safeExecuteOfPromise(() =>
    mysqlClient.queryAsync('DROP TABLE ??', [tableName]),
  );
  if (error) return error;
};
