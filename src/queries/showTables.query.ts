import { describe, expect, it, vi } from 'vitest';
import { MysqlClientMock } from '../__mocks__/infrastructures/mysqlClient.infrastructure.mock';
import { convertToErrorClass } from '../helpers/convert';
import { isArrayOfObjects } from '../helpers/typeCheck';
import { MysqlClientInterface } from '../interfaces/mysql.interface';

export const showTablesQuery = async (
  mysqlClient: MysqlClientInterface,
): Promise<{ databaseName: string; tableName: string }[] | Error> => {
  try {
    const tables = await mysqlClient.queryAsync('SHOW TABLES');
    if (!isArrayOfObjects(tables)) throw new Error('parseError');
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
    return convertToErrorClass(error);
  }
};

/**
 *
 * test
 *
 */
describe('showTables', () => {
  const mysqlClientMock = new MysqlClientMock();

  it('正常にTableが取得できる', async () => {
    // GIVEN: output({ databaseName: string; tableName: string }[])
    const tables: { databaseName: string; tableName: string }[] = [
      {
        databaseName: 'sample',
        tableName: 'sample',
      },
    ];

    // WHEN
    const result = await showTablesQuery(mysqlClientMock);

    // THEN
    expect(result).toEqual(tables);
  });

  it('クエリで取得したindexがオブジェクトの配列でない場合はエラー', async () => {
    vi.spyOn(mysqlClientMock, 'queryAsync').mockReturnValue(
      new Promise((resolve) => resolve(null)),
    );

    // GIVEN: output(Error)
    const error = new Error('parseError');

    // WHEN
    const result = await showTablesQuery(mysqlClientMock);

    // THEN
    expect(result).toEqual(error);
  });
});
