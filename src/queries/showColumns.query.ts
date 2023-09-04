import { MysqlClientInterface } from '../interfaces/mysql.interface';
import { ParseColumn } from '../parseColumn';
import { PrimitiveTypeString } from '../types/primitive.type';
import { ColumnSchema } from '../types/schema.type';

type ShowQueryOptions = {
  parseColumn: ParseColumn;
  convertTypeFn: (arg: string) => PrimitiveTypeString | string;
  isArrayOfObjects: (arg: unknown) => arg is { [key: string]: unknown }[];
};

export const showColumnsQuery = async (
  tableName: string,
  mysqlClient: MysqlClientInterface,
  options: ShowQueryOptions,
): Promise<ColumnSchema[] | Error> => {
  try {
    const columns = await mysqlClient.queryAsync('SHOW COLUMNS FROM ??', [tableName]);
    // TODO: エラーハンドリングを考える
    if (!options.isArrayOfObjects(columns)) throw new Error('parseError');
    const res = columns.map((column) =>
      options.parseColumn(column, { convertTypeFn: options.convertTypeFn }),
    );
    return res;
  } catch (error) {
    // TODO: エラーハンドリングを考える
    return new Error('parseError');
  }
};
