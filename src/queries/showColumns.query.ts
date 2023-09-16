import { safeExecuteOfPromise } from '../helpers/safeExecute';
import { isArrayOfObjects } from '../helpers/typeCheck';
import { MysqlClientInterface } from '../interfaces/mysql.interface';
import { parseColumn } from '../parsers/parseColumn';
import { ColumnSchema } from '../types/schema.type';

export const showColumnsQuery = async (
  tableName: string,
  mysqlClient: MysqlClientInterface,
): Promise<ColumnSchema[] | Error> => {
  const { data: columns, error } = await safeExecuteOfPromise(() =>
    mysqlClient.queryAsync('SHOW COLUMNS FROM ??', [tableName]),
  );
  if (error) return error;
  if (!isArrayOfObjects(columns)) return new Error('parseError');

  return columns.map((column) => parseColumn(column));
};
