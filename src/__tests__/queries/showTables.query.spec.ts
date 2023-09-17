import {
  MysqlClientErrorMock,
  MysqlClientMock,
} from '../../__mocks__/infrastructures/mysqlClient.infrastructure.mock';
import { showTablesQuery } from '../../queries/showTables.query';

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
    jest
      .spyOn(mysqlClientMock, 'queryAsync')
      .mockReturnValue(new Promise((resolve) => resolve(null)));

    // GIVEN: output(Error)
    const error = new Error('parseError');

    // WHEN
    const result = await showTablesQuery(mysqlClientMock);

    // THEN
    expect(result).toEqual(error);
  });

  it('クエリが失敗した場合はエラーを返す', async () => {
    // GIVEN: input(MysqlClientInterface)
    const mysqlClient = new MysqlClientErrorMock();

    // GIVEN: output(Error)
    const error = new Error('DBError');

    // WHEN
    const result = await showTablesQuery(mysqlClient);

    // THEN
    expect(result).toEqual(error);
  });
});
