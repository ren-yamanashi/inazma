import {
  MysqlClientErrorMock,
  MysqlClientMock,
} from '../../__mocks__/infrastructures/mysqlClient.infrastructure.mock';
import { dropTablesQuery } from '../../queries/dropTables.query';

describe('dropTables', () => {
  const tableName = 'sample';

  it('クエリが実行される', async () => {
    // GIVEN: input(MysqlClientInterface)
    const mysqlClient = new MysqlClientMock();

    // WHEN
    await dropTablesQuery(tableName, mysqlClient);

    // THEN: クエリが実行される
    expect(mysqlClient.queryAsync).toHaveBeenCalledWith('DROP TABLE ??', [tableName]);
  });

  it('クエリが失敗した場合はエラーを返す', async () => {
    // GIVEN: input(MysqlClientInterface)
    const mysqlClient = new MysqlClientErrorMock();

    // GIVEN: output(Error)
    const error = new Error('DBError');

    // WHEN
    const result = await dropTablesQuery(tableName, mysqlClient);

    // THEN
    expect(result).toEqual(error);
  });
});
