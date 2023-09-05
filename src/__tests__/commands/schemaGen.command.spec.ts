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

@Index(\"id_contents_idx\", [\"id\", \"content\"], {
unique: false
})
@Entity(\"sample\", {database: \"sample\"})
class Sample {
@AutoIncrementColumn({
type: "bigint",
default: null,
unsigned: true,
unique: true,
primary: true
})
id: number;

@Column({
type: "varchar(255)",
default: null,
unsigned: false,
unique: false,
primary: false
})
content: string | null;

@Column({
type: "int",
default: 0,
unsigned: true,
unique: false,
primary: false
})
order: number;

@Column({
type: "enum('active','inactive','deleted')",
default: Status.active,
unsigned: false,
unique: false,
primary: false
})
status: Status;

@DefaultGeneratedColumn({
type: "datetime",
default: NOW(),
unsigned: false,
unique: false,
primary: false
})
createdDate: Date;
};
`;

    // WHEN
    await schemaGen(mysqlClientConfig);

    // THEN: `writeFileSync`の引数が正しいか
    expect(fsMock.writeFileSync).toHaveBeenCalledWith('sample/db.schema.ts', schema);

    // THEN: connectionが終了したか
    expect(mysqlClientMock.endConnection).toHaveBeenCalled();
  });
});
