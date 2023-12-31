import { MysqlClientMock } from '../../__mocks__/infrastructures/mysqlClient.infrastructure.mock';
import { isArrayOfObjects } from '../../helpers/typeCheck';
import { showTablesQuery } from '../../queries/showTables.query';

describe('showTables', () => {
  const mysqlClientMock = new MysqlClientMock();
  const options = {
    isArrayOfObjects: isArrayOfObjects,
  };

  it('正常にTableが取得できる', async () => {
    // GIVEN: output({ databaseName: string; tableName: string }[])
    const tables: { databaseName: string; tableName: string }[] = [
      {
        databaseName: 'sample',
        tableName: 'sample',
      },
    ];

    // WHEN
    const result = await showTablesQuery(mysqlClientMock, options);

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
    const result = await showTablesQuery(mysqlClientMock, options);

    // THEN
    expect(result).toEqual(error);
  });
});
