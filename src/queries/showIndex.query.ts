import { safeExecuteOfPromise } from '../helpers/safeExecute';
import { isArrayOfObjects } from '../helpers/typeCheck';
import { MysqlClientInterface } from '../interfaces/mysql.interface';
import { parseIndexes } from '../parsers/parseIndex';
import { IndexSchema } from '../types/schema.type';

export const showIndexQuery = async (
  tableName: string,
  mysqlClient: MysqlClientInterface,
): Promise<IndexSchema[] | Error> => {
  const { data: indexes, error } = await safeExecuteOfPromise(() =>
    mysqlClient.queryAsync('SHOW INDEX FROM ??', [tableName]),
  );
  if (error) return error;
  if (!isArrayOfObjects(indexes)) return new Error('parseError');

  return parseIndexes(indexes);
};
