import * as mysql from 'mysql';
import {
  MysqlClientInterface,
  MysqlConnection,
  MysqlConnectionConfig,
} from '../interfaces/mysql.interface';

export class MysqlClient implements MysqlClientInterface {
  private connection: MysqlConnection | null;

  constructor() {
    this.connection = null;
  }

  public startConnection(connectionUri: string | MysqlConnectionConfig): void {
    const connection = mysql.createConnection(connectionUri);
    this.connection = connection;
  }

  public queryAsync(sql: string, values?: unknown): Promise<unknown> {
    return new Promise((resolve, reject) => {
      if (!this.connection) {
        resolve('connection not founded');
        return;
      }
      this.connection.query(sql, values, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  public endConnection(): void {
    if (!this.connection) return;
    this.connection?.end();
  }
}
