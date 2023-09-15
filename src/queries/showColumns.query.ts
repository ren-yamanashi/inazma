import { MysqlClientInterface } from '../interfaces/mysql.interface';
import { ParseColumn } from '../parsers/parseColumn';
import { PrimitiveTypeString } from '../types/primitive.type';
import { ColumnSchema } from '../types/schema.type';

type ShowQueryOptions = {
  parseColumn: ParseColumn;
  parseToPrimitiveTypeString: (arg: string) => PrimitiveTypeString | string;
  isArrayOfObjects: (arg: unknown) => arg is { [key: string]: unknown }[];
  convertToErrorClass: (error: unknown) => Error;
};

export const showColumnsQuery = async (
  tableName: string,
  mysqlClient: MysqlClientInterface,
  options: ShowQueryOptions,
): Promise<ColumnSchema[] | Error> => {
  try {
    const columns = await mysqlClient.queryAsync('SHOW COLUMNS FROM ??', [tableName]);
    if (!options.isArrayOfObjects(columns)) throw new Error('parseError');
    return columns.map((column) => options.parseColumn(column, options));
  } catch (error) {
    console.error(error);
    return options.convertToErrorClass(error);
  }
};
