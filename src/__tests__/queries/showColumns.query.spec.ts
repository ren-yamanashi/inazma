import { columnIncludeEnumSchemasDummy } from '../../__mocks__/columnSchema.dummy';
import {
  MysqlClientErrorMock,
  MysqlClientMock,
} from '../../__mocks__/infrastructures/mysqlClient.infrastructure.mock';
import { showColumnsQuery } from '../../queries/showColumns.query';

describe('showColumnsQuery', () => {
  const mysqlClientMock = new MysqlClientMock();
  const tableName = 'sample';

  it('正常にColumnが取得できる', async () => {
    // GIVEN: output(ColumnSchema[])
    const columnSchema = columnIncludeEnumSchemasDummy;

    // WHEN
    const result = await showColumnsQuery(tableName, mysqlClientMock);

    // THEN
    expect(result).toEqual(columnSchema);
  });

  it('クエリで取得したcolumnsがオブジェクトの配列でない場合はエラー', async () => {
    jest
      .spyOn(mysqlClientMock, 'queryAsync')
      .mockReturnValue(new Promise((resolve) => resolve(null)));

    // GIVEN: output(Error)
    const error = new Error('parseError');

    // WHEN
    const result = await showColumnsQuery(tableName, mysqlClientMock);

    // THEN
    expect(result).toEqual(error);
  });

  it('クエリが失敗した場合はエラーを返す', async () => {
    // GIVEN: input(MysqlClientInterface)
    const mysqlClient = new MysqlClientErrorMock();

    // GIVEN: output(Error)
    const error = new Error('DBError');

    // WHEN
    const result = await showColumnsQuery(tableName, mysqlClient);

    // THEN
    expect(result).toEqual(error);
  });
});
