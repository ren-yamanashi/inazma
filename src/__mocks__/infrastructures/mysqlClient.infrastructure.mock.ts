import { MysqlClientInterface } from '../../interfaces/mysql.interface';
import { columnDummy } from '../column.dummy';
import { indexDummy } from '../index.dummy';

export class MysqlClientMock implements MysqlClientInterface {
  public startConnection() {
    return;
  }
  public queryAsync(query: string) {
    return new Promise((resolve) => {
      if (query === 'SHOW TABLES') {
        resolve([{ tables: 'sample' }]);
      }
      if (query === 'SHOW INDEX FROM ??') {
        resolve(indexDummy);
      }
      if (query === 'SHOW COLUMNS FROM ??') {
        resolve(columnDummy);
      }
      resolve([]);
    });
  }
  public endConnection() {
    return;
  }
}
