import { describe, expect, it, vi } from 'vitest';
import { columnIncludeEnumSchemasDummy } from '../__mocks__/columnSchema.dummy';
import { MysqlClientMock } from '../__mocks__/infrastructures/mysqlClient.infrastructure.mock';
import { convertToErrorClass } from '../helpers/convert';
import { isArrayOfObjects } from '../helpers/typeCheck';
import { MysqlClientInterface } from '../interfaces/mysql.interface';
import { parseColumn } from '../parsers/parseColumn';
import { ColumnSchema } from '../types/schema.type';

export const showColumnsQuery = async (
  tableName: string,
  mysqlClient: MysqlClientInterface,
): Promise<ColumnSchema[] | Error> => {
  try {
    const columns = await mysqlClient.queryAsync('SHOW COLUMNS FROM ??', [tableName]);
    if (!isArrayOfObjects(columns)) throw new Error('parseError');
    return columns.map((column) => parseColumn(column));
  } catch (error) {
    console.error(error);
    return convertToErrorClass(error);
  }
};

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
    vi.spyOn(mysqlClientMock, 'queryAsync').mockReturnValue(
      new Promise((resolve) => resolve(null)),
    );

    // GIVEN: output(Error)
    const error = new Error('parseError');

    // WHEN
    const result = await showColumnsQuery(tableName, mysqlClientMock);

    // THEN
    expect(result).toEqual(error);
  });
});
