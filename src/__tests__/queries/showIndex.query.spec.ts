import { indexSchemasDummy } from '../../__mocks__/indexSchema.dummy';
import {
  MysqlClientErrorMock,
  MysqlClientMock,
} from '../../__mocks__/infrastructures/mysqlClient.infrastructure.mock';
import { showIndexQuery } from '../../queries/showIndex.query';

describe('showIndexQuery', () => {
  const mysqlClientMock = new MysqlClientMock();
  const tableName = 'sample';

  it('正常にIndexが取得できる', async () => {
    // GIVEN: output(IndexSchema[])
    const columnSchema = indexSchemasDummy;

    // WHEN
    const result = await showIndexQuery(tableName, mysqlClientMock);

    // THEN
    expect(result).toEqual(columnSchema);
  });

  it('クエリで取得したindexがオブジェクトの配列でない場合はエラー', async () => {
    jest
      .spyOn(mysqlClientMock, 'queryAsync')
      .mockReturnValue(new Promise((resolve) => resolve(null)));

    // GIVEN: output(Error)
    const error = new Error('parseError');

    // WHEN
    const result = await showIndexQuery(tableName, mysqlClientMock);

    // THEN
    expect(result).toEqual(error);
  });

  it('クエリが失敗した場合はエラーを返す', async () => {
    // GIVEN: input(MysqlClientInterface)
    const mysqlClient = new MysqlClientErrorMock();

    // GIVEN: output(Error)
    const error = new Error('DBError');

    // WHEN
    const result = await showIndexQuery(tableName, mysqlClient);

    // THEN
    expect(result).toEqual(error);
  });
});
