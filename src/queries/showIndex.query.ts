import { MysqlClientInterface } from '../interfaces/mysql.interface';
import { IndexSchema } from '../types/schema.type';

type ShowQueryOptions = {
  parseIndexes: (args: { [key: string]: unknown }[]) => IndexSchema[];
  isArrayOfObjects: (arg: unknown) => arg is { [key: string]: unknown }[];
  convertToErrorClass: (error: unknown) => Error;
};

export const showIndexQuery = async (
  tableName: string,
  mysqlClient: MysqlClientInterface,
  options: ShowQueryOptions,
): Promise<IndexSchema[] | Error> => {
  try {
    const indexes = await mysqlClient.queryAsync('SHOW INDEX FROM ??', [tableName]);
    if (!options.isArrayOfObjects(indexes)) throw new Error('parseError');
    return options.parseIndexes(indexes);
  } catch (error) {
    console.error(error);
    return options.convertToErrorClass(error);
  }
};
