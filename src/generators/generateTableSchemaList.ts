import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MysqlClientMock } from '../__mocks__/infrastructures/mysqlClient.infrastructure.mock';
import { container, mysqlClientKey, registerContainer } from '../di';
import { MysqlClientInterface } from '../interfaces/mysql.interface';
import { showColumnsQuery } from '../queries/showColumns.query';
import { showIndexQuery } from '../queries/showIndex.query';
import { showTablesQuery } from '../queries/showTables.query';
import { TableSchema } from '../types/schema.type';

export const generateTableSchemaList = async (
  mysqlClient: MysqlClientInterface,
): Promise<TableSchema[] | Error> => {
  const tableSchemas: TableSchema[] = [];

  // NOTE: table一覧の取得
  const tables = await showTablesQuery(mysqlClient);
  if (tables instanceof Error) return new Error('parseError');

  for (const table of tables) {
    // NOTE: index一覧の取得
    const indexes = await showIndexQuery(table.tableName, mysqlClient);
    if (indexes instanceof Error) return new Error('parseError');

    // NOTE: column一覧の取得
    const columns = await showColumnsQuery(table.tableName, mysqlClient);
    if (columns instanceof Error) return new Error('parseError');

    tableSchemas.push({ database: table.databaseName, name: table.tableName, indexes, columns });
  }

  return tableSchemas;
};

/**
 *
 * test
 *
 */
describe('generateTableSchemaList', () => {
  const APP_ENV = process.env.APP_ENV;
  let mysqlClientMock: MysqlClientMock;

  beforeEach(() => {
    process.env.APP_ENV = 'test';
    registerContainer();

    mysqlClientMock = new MysqlClientMock();

    container.register(mysqlClientKey, mysqlClientMock);

    vi.spyOn(mysqlClientMock, 'endConnection');
  });

  afterEach(() => {
    process.env.APP_ENV = APP_ENV;
  });

  it('正常にschemaが生成される', async () => {
    // GIVEN: response(schema)
    const tableSchema: TableSchema = {
      columns: [
        {
          defaultValue: null,
          extra: 'auto_increment',
          field: 'id',
          key: 'PRI',
          nullable: false,
          typeInDb: 'bigint',
          typeInTs: 'number',
          unsigned: true,
        },
        {
          defaultValue: null,
          extra: '',
          field: 'content',
          key: '',
          nullable: true,
          typeInDb: 'varchar(255)',
          typeInTs: 'string',
          unsigned: false,
        },
        {
          defaultValue: '0',
          extra: '',
          field: 'order',
          key: '',
          nullable: false,
          typeInDb: 'int',
          typeInTs: 'number',
          unsigned: true,
        },
        {
          defaultValue: 'active',
          extra: '',
          field: 'status',
          key: '',
          nullable: false,
          typeInDb: "enum('active','inactive','deleted')",
          typeInTs: "enum('active','inactive','deleted')",
          unsigned: false,
        },
        {
          defaultValue: 'NOW()',
          extra: 'DEFAULT_GENERATED',
          field: 'createdDate',
          key: '',
          nullable: false,
          typeInDb: 'datetime',
          typeInTs: 'Date',
          unsigned: false,
        },
      ],
      database: 'sample',
      indexes: [{ columnNames: ['id', 'content'], keyName: 'id_contents_idx', unique: false }],
      name: 'sample',
    };

    // WHEN
    const result = await generateTableSchemaList(mysqlClientMock);

    // THEN: 関数の戻り値が正しいか
    expect(result).toEqual([tableSchema]);
  });
});
