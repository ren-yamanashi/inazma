import { MysqlClientInterface } from '../interfaces/mysql.interface';
import { ParseColumn } from '../parser/parseColumn';
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
    if (!options.isArrayOfObjects(columns)) throw new Error('parseError');
    return columns.map((column) =>
      options.parseColumn(column, { convertTypeFn: options.convertTypeFn }),
    );
  } catch (error) {
    console.error(error);
    return new Error('parseError');
  }
};
