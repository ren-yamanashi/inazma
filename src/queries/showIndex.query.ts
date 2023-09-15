import { describe, expect, it, vi } from 'vitest';
import { indexSchemasDummy } from '../__mocks__/indexSchema.dummy';
import { MysqlClientMock } from '../__mocks__/infrastructures/mysqlClient.infrastructure.mock';
import { convertToErrorClass } from '../helpers/convert';
import { isArrayOfObjects } from '../helpers/typeCheck';
import { MysqlClientInterface } from '../interfaces/mysql.interface';
import { parseIndexes } from '../parsers/parseIndex';
import { IndexSchema } from '../types/schema.type';

export const showIndexQuery = async (
  tableName: string,
  mysqlClient: MysqlClientInterface,
): Promise<IndexSchema[] | Error> => {
  try {
    const indexes = await mysqlClient.queryAsync('SHOW INDEX FROM ??', [tableName]);
    if (!isArrayOfObjects(indexes)) throw new Error('parseError');
    return parseIndexes(indexes);
  } catch (error) {
    console.error(error);
    return convertToErrorClass(error);
  }
};

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
    vi.spyOn(mysqlClientMock, 'queryAsync').mockReturnValue(
      new Promise((resolve) => resolve(null)),
    );

    // GIVEN: output(Error)
    const error = new Error('parseError');

    // WHEN
    const result = await showIndexQuery(tableName, mysqlClientMock);

    // THEN
    expect(result).toEqual(error);
  });
});
