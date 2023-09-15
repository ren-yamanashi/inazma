/* eslint-disable no-useless-escape */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FileSystemMock } from '../__mocks__/infrastructures/fileSystem.infrastructure.mock';
import { MysqlClientMock } from '../__mocks__/infrastructures/mysqlClient.infrastructure.mock';
import { container, fileSystemKey, mysqlClientKey, registerContainer } from '../di';
import { generateStringFromSchema } from '../generators/generateStringFromSchema';
import { generateTableSchemaList } from '../generators/generateTableSchemaList';
import { convertToErrorClass } from '../helpers/convert';
import { safeExecute } from '../helpers/safeExecute';
import { MysqlConnectionConfig } from '../interfaces/mysql.interface';

export const schemaGen = async (
  mysqlClientConfig: MysqlConnectionConfig,
  outputFile = '.out/db.schema.ts',
): Promise<void | Error> => {
  const mysqlClient = container.resolve(mysqlClientKey);
  const fs = container.resolve(fileSystemKey);

  try {
    const { error: startConnectionError } = safeExecute(() =>
      mysqlClient.startConnection(mysqlClientConfig),
    );
    if (startConnectionError) return new Error('connectionError');

    const tableSchemas = await generateTableSchemaList(mysqlClient);
    if (tableSchemas instanceof Error) return tableSchemas;

    // NOTE: schema作成
    const stringSchema = generateStringFromSchema(tableSchemas);

    // NOTE: schema出力
    const { error: writeFileError } = safeExecute(() => fs.writeFileSync(outputFile, stringSchema));
    if (writeFileError) return new Error('writeFileError');
  } catch (error) {
    console.error(error);
    return convertToErrorClass(error);
  } finally {
    mysqlClient.endConnection();
  }
};

/**
 *
 * test
 *
 */
describe('schemaGen', () => {
  const APP_ENV = process.env.APP_ENV;
  let fsMock: FileSystemMock;
  let mysqlClientMock: MysqlClientMock;

  beforeEach(() => {
    process.env.APP_ENV = 'test';
    registerContainer();

    fsMock = new FileSystemMock();
    mysqlClientMock = new MysqlClientMock();

    container.register(fileSystemKey, fsMock);
    container.register(mysqlClientKey, mysqlClientMock);

    vi.spyOn(fsMock, 'writeFileSync');
    vi.spyOn(mysqlClientMock, 'endConnection');
  });

  afterEach(() => {
    process.env.APP_ENV = APP_ENV;
  });

  it('正常にschemaが生成される', async () => {
    // GIVEN: input(MysqlConnectionConfig)
    const mysqlClientConfig: MysqlConnectionConfig = {
      host: 'sample',
      user: 'test',
      password: 'test',
      database: 'sample',
    };

    // GIVEN: response(schema)
    const schema = `enum Status {
active,
inactive,
deleted
};

const Sample: TableSchema = {
database: 'sample',
name: 'sample',
columns: [{
field: 'id',
typeInTs: 'number',
typeInDb: 'bigint',
unsigned: true,
nullable: false,
key: 'PRI',
defaultValue: null,
extra: 'auto_increment'
},
{
field: 'content',
typeInTs: 'string',
typeInDb: 'varchar(255)',
unsigned: false,
nullable: true,
key: '',
defaultValue: null,
extra: ''
},
{
field: 'order',
typeInTs: 'number',
typeInDb: 'int',
unsigned: true,
nullable: false,
key: '',
defaultValue: '0',
extra: ''
},
{
field: 'status',
typeInTs: \"enum('active','inactive','deleted')\",
typeInDb: \"enum('active','inactive','deleted')\",
unsigned: false,
nullable: false,
key: '',
defaultValue: 'Status.active',
extra: ''
},
{
field: 'createdDate',
typeInTs: 'Date',
typeInDb: 'datetime',
unsigned: false,
nullable: false,
key: '',
defaultValue: 'NOW()',
extra: 'DEFAULT_GENERATED'
}] as ColumnSchema[],
indexes: [{
keyName: 'id_contents_idx',
unique: false,
columnNames: [\"id\", \"content\"]
}] as IndexSchema[]
}`;

    // WHEN
    await schemaGen(mysqlClientConfig);

    // THEN: `writeFileSync`の引数が正しいか
    expect(fsMock.writeFileSync).toHaveBeenCalledWith('.out/db.schema.ts', schema);

    // THEN: connectionが終了したか
    expect(mysqlClientMock.endConnection).toHaveBeenCalled();
  });
});
