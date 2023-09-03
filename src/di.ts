import { Container, InjectionKey } from './helpers/container';
import { FileSystem } from './infrastructures/fileSystem.infrastructure';
import { MysqlClient } from './infrastructures/mysqlClient.infrastructure';
import { FileSystemInterface } from './interfaces/fileSystem.interface';
import { MysqlClientInterface } from './interfaces/mysql.interface';

export const container = new Container();

/**
 * container keys
 */
export const fileSystemKey: InjectionKey<FileSystemInterface> = Symbol();
export const mysqlClientKey: InjectionKey<MysqlClientInterface> = Symbol();

export const registerContainer = () => {
  if (process.env.APP_ENV == 'test') return;

  container.register(fileSystemKey, new FileSystem());
  container.register(mysqlClientKey, new MysqlClient());
};
