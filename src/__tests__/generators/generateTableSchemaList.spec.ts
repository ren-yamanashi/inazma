import { MysqlClientMock } from '../../__mocks__/infrastructures/mysqlClient.infrastructure.mock';
import { container, mysqlClientKey, registerContainer } from '../../di';
import { generateTableSchemaList } from '../../generators/generateTableSchemaList';
import { TableSchema } from '../../types/schema.type';

describe('generateTableSchemaList', () => {
  const APP_ENV = process.env.APP_ENV;
  let mysqlClientMock: MysqlClientMock;

  beforeEach(() => {
    process.env.APP_ENV = 'test';
    registerContainer();

    mysqlClientMock = new MysqlClientMock();

    container.register(mysqlClientKey, mysqlClientMock);

    jest.spyOn(mysqlClientMock, 'endConnection');
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
