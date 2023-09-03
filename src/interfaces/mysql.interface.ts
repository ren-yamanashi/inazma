import * as events from 'events';
import * as stream from 'stream';
import * as tls from 'tls';

/* eslint-disable @typescript-eslint/no-explicit-any */

type TypeCast =
  | boolean
  | ((
      field: UntypedFieldInfo & {
        type: string;
        length: number;
        string(): null | string;
        buffer(): null | Buffer;
        geometry(): null | GeometryType;
      },
      next: () => void,
    ) => any);

type packetCallback = (packet: any) => void;

export type queryCallback = (err: MysqlError | null, results?: any, fields?: FieldInfo[]) => void;

enum Types {
  DECIMAL = 0x00, // aka DECIMAL (http://dev.mysql.com/doc/refman/5.0/en/precision-math-decimal-changes.html)
  TINY = 0x01, // aka TINYINT, 1 byte
  SHORT = 0x02, // aka SMALLINT, 2 bytes
  LONG = 0x03, // aka INT, 4 bytes
  FLOAT = 0x04, // aka FLOAT, 4-8 bytes
  DOUBLE = 0x05, // aka DOUBLE, 8 bytes
  NULL = 0x06, // NULL (used for prepared statements, I think)
  TIMESTAMP = 0x07, // aka TIMESTAMP
  LONGLONG = 0x08, // aka BIGINT, 8 bytes
  INT24 = 0x09, // aka MEDIUMINT, 3 bytes
  DATE = 0x0a, // aka DATE
  TIME = 0x0b, // aka TIME
  DATETIME = 0x0c, // aka DATETIME
  YEAR = 0x0d, // aka YEAR, 1 byte (don't ask)
  NEWDATE = 0x0e, // aka ?
  VARCHAR = 0x0f, // aka VARCHAR (?)
  BIT = 0x10, // aka BIT, 1-8 byte
  TIMESTAMP2 = 0x11, // aka TIMESTAMP with fractional seconds
  DATETIME2 = 0x12, // aka DATETIME with fractional seconds
  TIME2 = 0x13, // aka TIME with fractional seconds
  JSON = 0xf5, // aka JSON
  NEWDECIMAL = 0xf6, // aka DECIMAL
  ENUM = 0xf7, // aka ENUM
  SET = 0xf8, // aka SET
  TINY_BLOB = 0xf9, // aka TINYBLOB, TINYTEXT
  MEDIUM_BLOB = 0xfa, // aka MEDIUMBLOB, MEDIUMTEXT
  LONG_BLOB = 0xfb, // aka LONGBLOG, LONGTEXT
  BLOB = 0xfc, // aka BLOB, TEXT
  VAR_STRING = 0xfd, // aka VARCHAR, VARBINARY
  STRING = 0xfe, // aka CHAR, BINARY
  GEOMETRY = 0xff, // aka GEOMETRY
}

interface GeometryType extends Array<{ x: number; y: number } | GeometryType> {
  x: number;
  y: number;
}

interface FieldInfo extends UntypedFieldInfo {
  type: Types;
}

interface UntypedFieldInfo {
  catalog: string;
  db: string;
  table: string;
  orgTable: string;
  name: string;
  orgName: string;
  charsetNr: number;
  length: number;
  flags: number;
  decimals: number;
  default?: string | undefined;
  zeroFill: boolean;
  protocol41: boolean;
}

export interface ConnectionOptions {
  user?: string | undefined;
  password?: string | undefined;
  database?: string | undefined;
  charset?: string | undefined;
  timeout?: number | undefined;
}

export interface MysqlConnectionConfig extends ConnectionOptions {
  host?: string | undefined;
  port?: number | undefined;
  localAddress?: string | undefined;
  socketPath?: string | undefined;
  timezone?: string | undefined;
  connectTimeout?: number | undefined;
  stringifyObjects?: boolean | undefined;
  insecureAuth?: boolean | undefined;
  typeCast?: TypeCast | undefined;
  queryFormat?(query: string, values: any): string;
  supportBigNumbers?: boolean | undefined;
  bigNumberStrings?: boolean | undefined;
  dateStrings?: boolean | Array<'TIMESTAMP' | 'DATETIME' | 'DATE'> | undefined;
  trace?: boolean | undefined;
  multipleStatements?: boolean | undefined;
  flags?: string | string[] | undefined;
  debug?: boolean | string[] | Types[] | undefined | any;
  ssl?:
    | string
    | (tls.SecureContextOptions & { rejectUnauthorized?: boolean | undefined })
    | undefined;
}

export interface PoolSpecificConfig {
  /**
   * The milliseconds before a timeout occurs during the connection acquisition. This is slightly different from connectTimeout,
   * because acquiring a pool connection does not always involve making a connection. (Default: 10 seconds)
   */
  acquireTimeout?: number | undefined;

  /**
   * Determines the pool's action when no connections are available and the limit has been reached. If true, the pool will queue
   * the connection request and call it when one becomes available. If false, the pool will immediately call back with an error.
   * (Default: true)
   */
  waitForConnections?: boolean | undefined;

  /**
   * The maximum number of connections to create at once. (Default: 10)
   */
  connectionLimit?: number | undefined;

  /**
   * The maximum number of connection requests the pool will queue before returning an error from getConnection. If set to 0, there
   * is no limit to the number of queued connection requests. (Default: 0)
   */
  queueLimit?: number | undefined;
}

export interface EscapeFunctions {
  escape(value: any, stringifyObjects?: boolean, timeZone?: string): string;
  escapeId(value: string, forbidQualified?: boolean): string;
  format(sql: string, values: any[], stringifyObjects?: boolean, timeZone?: string): string;
}

export interface MysqlError extends Error {
  code: string;
  errno: number;
  sqlStateMarker?: string | undefined;
  sqlState?: string | undefined;
  fieldCount?: number | undefined;
  fatal: boolean;
  sql?: string | undefined;
  sqlMessage?: string | undefined;
}

export interface Query {
  sql: string;
  values?: string[] | undefined;
  typeCast?: TypeCast | undefined;
  nestedTables: boolean;
  start(): void;
  determinePacket(byte: number, parser: any): any;
  OkPacket: packetCallback;
  ErrorPacket: packetCallback;
  ResultSetHeaderPacket: packetCallback;
  FieldPacket: packetCallback;
  EofPacket: packetCallback;

  RowDataPacket(packet: any, parser: any, connection: MysqlConnection): void;

  /**
   * Creates a Readable stream with the given options
   *
   * @param options The options for the stream. (see readable-stream package)
   */
  stream(options?: stream.ReadableOptions): stream.Readable;

  on(ev: string, callback: (...args: any[]) => void): Query;

  on(ev: 'result', callback: (row: any, index: number) => void): Query;

  on(ev: 'error', callback: (err: MysqlError) => void): Query;

  on(ev: 'fields', callback: (fields: FieldInfo[], index: number) => void): Query;

  on(ev: 'packet', callback: (packet: any) => void): Query;

  on(ev: 'end', callback: () => void): Query;
}

export interface QueryOptions {
  sql: string;
  values?: any;
  timeout?: number | undefined;
  nestTables?: any;
  typeCast?: TypeCast | undefined;
}

export interface QueryFunction {
  (query: Query): Query;

  (options: string | QueryOptions, callback?: queryCallback): Query;

  (options: string | QueryOptions, values: any, callback?: queryCallback): Query;
}

export interface MysqlConnection extends EscapeFunctions, events.EventEmitter {
  config: MysqlConnectionConfig;
  state: 'connected' | 'authenticated' | 'disconnected' | 'protocol_error' | string;
  threadId: number | null;
  createQuery: QueryFunction;
  connect(callback?: (err: MysqlError, ...args: any[]) => void): void;
  connect(options: any, callback?: (err: MysqlError, ...args: any[]) => void): void;
  changeUser(options: ConnectionOptions, callback?: (err: MysqlError) => void): void;
  changeUser(callback: (err: MysqlError) => void): void;
  beginTransaction(options?: QueryOptions, callback?: (err: MysqlError) => void): void;
  beginTransaction(callback: (err: MysqlError) => void): void;
  commit(options?: QueryOptions, callback?: (err: MysqlError) => void): void;
  commit(callback: (err: MysqlError) => void): void;
  rollback(options?: QueryOptions, callback?: (err: MysqlError) => void): void;
  rollback(callback: (err: MysqlError) => void): void;
  query: QueryFunction;
  ping(options?: QueryOptions, callback?: (err: MysqlError) => void): void;
  ping(callback: (err: MysqlError) => void): void;
  statistics(options?: QueryOptions, callback?: (err: MysqlError) => void): void;
  statistics(callback: (err: MysqlError) => void): void;
  end(callback?: (err?: MysqlError) => void): void;
  end(options: any, callback: (err?: MysqlError) => void): void;
  destroy(): void;
  pause(): void;
  resume(): void;
}

export interface MysqlClientInterface {
  startConnection(connectionUri: string | MysqlConnectionConfig): void;
  queryAsync(sql: string, values?: unknown[]): Promise<unknown>;
  endConnection(): void;
}
