import { describe, expect, it, vi } from 'vitest';
import { indexSchemasDummy } from '../../__mocks__/indexSchema.dummy';
import { MysqlClientMock } from '../../__mocks__/infrastructures/mysqlClient.infrastructure.mock';
import { convertToErrorClass } from '../../helpers/convert';
import { isArrayOfObjects } from '../../helpers/typeCheck';
import { parseIndexes } from '../../parsers/parseIndex';
import { showIndexQuery } from '../../queries/showIndex.query';

describe('showIndexQuery', () => {
  const mysqlClientMock = new MysqlClientMock();
  const tableName = 'sample';
  const options = {
    parseIndexes: parseIndexes,
    isArrayOfObjects: isArrayOfObjects,
    convertToErrorClass: convertToErrorClass,
  };

  it('正常にIndexが取得できる', async () => {
    // GIVEN: output(IndexSchema[])
    const columnSchema = indexSchemasDummy;

    // WHEN
    const result = await showIndexQuery(tableName, mysqlClientMock, options);

    // THEN
    expect(result).toEqual(columnSchema);
  });

  it('クエリで取得したindexがオブジェクトの配列でない場合はエラー', async () => {
    vi.spyOn(mysqlClientMock, 'queryAsync').mockReturnValue(
      new Promise((resolve) => resolve(null)),
    );

    // GIVEN: output(Error)
    const error = new Error('parseError');

    // WHEN
    const result = await showIndexQuery(tableName, mysqlClientMock, options);

    // THEN
    expect(result).toEqual(error);
  });
});
