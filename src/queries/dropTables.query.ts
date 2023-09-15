import { describe, expect, it } from 'vitest';
import {
  MysqlClientErrorMock,
  MysqlClientMock,
} from '../__mocks__/infrastructures/mysqlClient.infrastructure.mock';
import { convertToErrorClass } from '../helpers/convert';
import { MysqlClientInterface } from '../interfaces/mysql.interface';

export const dropTablesQuery = async (
  tableNameList: string[],
  mysqlClient: MysqlClientInterface,
): Promise<void | Error> => {
  try {
    await Promise.all(
      tableNameList.map(async (tableName) => mysqlClient.queryAsync('DROP TABLE ??', [tableName])),
    );
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
describe('dropTables', () => {
  it('クエリが実行される', async () => {
    // GIVEN: input(MysqlClientInterface)
    const mysqlClient = new MysqlClientMock();

    // GIVEN: input(tableNameList)
    const tables = ['table1', 'table2', 'table3'];

    // WHEN
    await dropTablesQuery(tables, mysqlClient);

    // THEN: クエリが実行される
    tables.forEach((table) => {
      expect(mysqlClient.queryAsync).toHaveBeenCalledWith('DROP TABLE ??', [table]);
    });

    // THEN: クエリがテーブルの数だけ実行される
    expect(mysqlClient.queryAsync).toHaveBeenCalledTimes(tables.length);
  });

  it('クエリが失敗した場合はエラーを返す', async () => {
    // GIVEN: input(MysqlClientInterface)
    const mysqlClient = new MysqlClientErrorMock();

    // GIVEN: input(tableNameList)
    const tables = ['table1', 'table2'];

    // WHEN
    const result = await dropTablesQuery(tables, mysqlClient);

    // THEN
    expect(result).toBeInstanceOf(Error);
    expect((result as Error).message).toBe('DBError');
  });
});
