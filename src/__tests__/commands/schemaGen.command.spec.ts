import { FileSystemMock } from '../../__mocks__/infrastructures/fileSystem.infrastructure.mock';
import { MysqlClientMock } from '../../__mocks__/infrastructures/mysqlClient.infrastructure.mock';
import { schemaGen } from '../../commands/schemaGen.command';
import { container, fileSystemKey, mysqlClientKey, registerContainer } from '../../di';
import { MysqlConnectionConfig } from '../../interfaces/mysql.interface';

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

    jest.spyOn(fsMock, 'writeFileSync');
    jest.spyOn(mysqlClientMock, 'endConnection');
  });

  beforeEach(() => {
    process.env.APP_ENV = APP_ENV;
  });

  it('should generate schema successfully', async () => {
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
    expect(fsMock.writeFileSync).toHaveBeenCalledWith('sample/db.schema.ts', schema);

    // THEN: connectionが終了したか
    expect(mysqlClientMock.endConnection).toHaveBeenCalled();
  });
});
