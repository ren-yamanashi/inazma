import { columnIncludeEnumSchemasDummy } from '../../__mocks__/columnSchema.dummy';
import { MysqlClientMock } from '../../__mocks__/infrastructures/mysqlClient.infrastructure.mock';
import { convertToErrorClass } from '../../helpers/convert';
import { isArrayOfObjects } from '../../helpers/typeCheck';
import { parseColumn, parseToPrimitiveTypeString } from '../../parser/parseColumn';
import { showColumnsQuery } from '../../queries/showColumns.query';

describe('showColumnsQuery', () => {
  const mysqlClientMock = new MysqlClientMock();
  const tableName = 'sample';
  const options = {
    parseColumn: parseColumn,
    parseToPrimitiveTypeString: parseToPrimitiveTypeString,
    isArrayOfObjects: isArrayOfObjects,
    convertToErrorClass: convertToErrorClass,
  };

  it('正常にColumnが取得できる', async () => {
    // GIVEN: output(ColumnSchema[])
    const columnSchema = columnIncludeEnumSchemasDummy;

    // WHEN
    const result = await showColumnsQuery(tableName, mysqlClientMock, options);

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
    const result = await showColumnsQuery(tableName, mysqlClientMock, options);

    // THEN
    expect(result).toEqual(error);
  });
});
