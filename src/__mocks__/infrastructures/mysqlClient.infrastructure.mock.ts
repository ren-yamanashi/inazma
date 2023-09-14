import { jest } from '@jest/globals';
import { MysqlClientInterface } from '../../interfaces/mysql.interface';
import { columnDummy } from '../column.dummy';
import { indexDummy } from '../index.dummy';

export class MysqlClientMock implements MysqlClientInterface {
  public startConnection() {
    return;
  }

  public queryAsync = jest.fn((query: string) => {
    return new Promise((resolve) => {
      if (query === 'SHOW TABLES') {
        resolve([{ Tables_in_sample: 'sample' }]);
      }
      if (query.startsWith('SHOW INDEX FROM')) {
        resolve(indexDummy);
      }
      if (query.startsWith('SHOW COLUMNS FROM')) {
        resolve(columnDummy);
      }
      if (query.startsWith('DROP TABLE')) {
        resolve(undefined);
      }
      resolve([]);
    });
  });

  public endConnection() {
    return;
  }
}

export class MysqlClientErrorMock implements MysqlClientInterface {
  public startConnection() {
    throw new Error('DB error');
  }

  public queryAsync = jest.fn((query: string) => {
    return new Promise((resolve, reject) => {
      if (query === 'SHOW TABLES') {
        reject(new Error('DBError'));
      }
      if (query.startsWith('SHOW INDEX FROM')) {
        reject(new Error('DBError'));
      }
      if (query.startsWith('SHOW COLUMNS FROM')) {
        reject(new Error('DBError'));
      }
      if (query.startsWith('DROP TABLE')) {
        reject(new Error('DBError'));
      }
      reject(undefined);
    });
  });

  public endConnection() {
    throw new Error('DB error');
  }
}
