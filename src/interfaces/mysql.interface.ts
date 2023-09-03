import * as stream from 'stream';
import { SecureContextOptions } from './tls.interface';

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

type queryCallback = (err: MysqlError | null, results?: any, fields?: FieldInfo[]) => void;

enum Types {
  DECIMAL = 0x00,
  TINY = 0x01,
  SHORT = 0x02,
  LONG = 0x03,
  FLOAT = 0x04,
  DOUBLE = 0x05,
  NULL = 0x06,
  TIMESTAMP = 0x07,
  LONGLONG = 0x08,
  INT24 = 0x09,
  DATE = 0x0a,
  TIME = 0x0b,
  DATETIME = 0x0c,
  YEAR = 0x0d,
  NEWDATE = 0x0e,
  VARCHAR = 0x0f,
  BIT = 0x10,
  TIMESTAMP2 = 0x11,
  DATETIME2 = 0x12,
  TIME2 = 0x13,
  JSON = 0xf5,
  NEWDECIMAL = 0xf6,
  ENUM = 0xf7,
  SET = 0xf8,
  TINY_BLOB = 0xf9,
  MEDIUM_BLOB = 0xfa,
  LONG_BLOB = 0xfb,
  BLOB = 0xfc,
  VAR_STRING = 0xfd,
  STRING = 0xfe,
  GEOMETRY = 0xff,
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

interface ConnectionOptions {
  user?: string | undefined;
  password?: string | undefined;
  database?: string | undefined;
  charset?: string | undefined;
  timeout?: number | undefined;
}

interface EscapeFunctions {
  escape(value: any, stringifyObjects?: boolean, timeZone?: string): string;
  escapeId(value: string, forbidQualified?: boolean): string;
  format(sql: string, values: any[], stringifyObjects?: boolean, timeZone?: string): string;
}

interface MysqlError extends Error {
  code: string;
  errno: number;
  sqlStateMarker?: string | undefined;
  sqlState?: string | undefined;
  fieldCount?: number | undefined;
  fatal: boolean;
  sql?: string | undefined;
  sqlMessage?: string | undefined;
}

interface Query {
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
  stream(options?: stream.ReadableOptions): stream.Readable;
  on(ev: string, callback: (...args: any[]) => void): Query;
  on(ev: 'result', callback: (row: any, index: number) => void): Query;
  on(ev: 'error', callback: (err: MysqlError) => void): Query;
  on(ev: 'fields', callback: (fields: FieldInfo[], index: number) => void): Query;
  on(ev: 'packet', callback: (packet: any) => void): Query;
  on(ev: 'end', callback: () => void): Query;
}

interface QueryOptions {
  sql: string;
  values?: any;
  timeout?: number | undefined;
  nestTables?: any;
  typeCast?: TypeCast | undefined;
}

interface QueryFunction {
  (query: Query): Query;
  (options: string | QueryOptions, callback?: queryCallback): Query;
  (options: string | QueryOptions, values: any, callback?: queryCallback): Query;
}

export interface MysqlConnection extends EscapeFunctions, NodeJS.EventEmitter {
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
  ssl?: string | (SecureContextOptions & { rejectUnauthorized?: boolean | undefined }) | undefined;
}

export interface MysqlClientInterface {
  startConnection(connectionUri: string | MysqlConnectionConfig): void;
  queryAsync(sql: string, values?: unknown[]): Promise<unknown>;
  endConnection(): void;
}
