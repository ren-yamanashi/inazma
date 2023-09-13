import { MysqlClientInterface } from '../interfaces/mysql.interface';

type ShowTablesOptions = {
  isArrayOfObjects: (arg: unknown) => arg is { [key: string]: unknown }[];
};

export const showTablesQuery = async (
  mysqlClient: MysqlClientInterface,
  options: ShowTablesOptions,
): Promise<{ databaseName: string; tableName: string }[] | Error> => {
  try {
    const tables = await mysqlClient.queryAsync('SHOW TABLES');
    if (!options.isArrayOfObjects(tables)) throw new Error('parseError');
    return tables.map((table) => {
      const databaseName = Object.keys(table)[0].replace(/Tables_in_/, '');
      const tableName = Object.values(table)[0];
      if (typeof tableName !== 'string') throw new Error('parseError');
      return {
        databaseName,
        tableName,
      };
    });
  } catch (error) {
    console.error(error);
    return new Error('parseError');
  }
};
