import { MysqlClientInterface } from '../interfaces/mysql.interface';
import { IndexSchema } from '../types/schema.type';

type ShowQueryOptions = {
  parseIndexes: (args: { [key: string]: unknown }[]) => IndexSchema[];
  isArrayOfObjects: (arg: unknown) => arg is { [key: string]: unknown }[];
};

export const showIndexQuery = async (
  tableName: string,
  mysqlClient: MysqlClientInterface,
  options: ShowQueryOptions,
): Promise<IndexSchema[] | Error> => {
  try {
    const indexes = await mysqlClient.queryAsync('SHOW INDEX FROM ??', [tableName]);
    // TODO: エラーハンドリングを考える
    if (!options.isArrayOfObjects(indexes)) throw new Error('parseError');
    return options.parseIndexes(indexes);
  } catch (error) {
    // TODO: エラーハンドリングを考える
    return new Error('parseError');
  }
};
