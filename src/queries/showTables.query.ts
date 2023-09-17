import { safeExecuteOfPromise } from '../helpers/safeExecute';
import { isArrayOfObjects } from '../helpers/typeCheck';
import { MysqlClientInterface } from '../interfaces/mysql.interface';

export const showTablesQuery = async (
  mysqlClient: MysqlClientInterface,
): Promise<{ databaseName: string; tableName: string }[] | Error> => {
  const { data: tables, error } = await safeExecuteOfPromise(() =>
    mysqlClient.queryAsync('SHOW TABLES'),
  );
  if (error) return error;
  if (!isArrayOfObjects(tables)) return new Error('parseError');

  return tables.map((table) => {
    // TODO: 関数に切り出す
    const databaseName = Object.keys(table)[0].replace(/Tables_in_/, '');
    const tableName = Object.values(table)[0];
    if (typeof tableName !== 'string') throw new Error('parseError');
    return {
      databaseName,
      tableName,
    };
  });
};
