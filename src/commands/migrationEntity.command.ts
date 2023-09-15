import { container, mysqlClientKey } from '../di';
import { generateTableSchemaList } from '../generators/generateTableSchemaList';
import { convertToErrorClass } from '../helpers/convert';
import { safeExecute } from '../helpers/safeExecute';
import { MysqlClientInterface, MysqlConnectionConfig } from '../interfaces/mysql.interface';
import { dropTablesQuery } from '../queries/dropTables.query';
import { TableSchema } from '../types/schema.type';

export const migrationEntity = async (
  tableSchemaList: TableSchema[],
  mysqlClientConfig: MysqlConnectionConfig,
): Promise<void | Error> => {
  const mysqlClient = container.resolve(mysqlClientKey);
  try {
    const { error: startConnectionError } = safeExecute(() =>
      mysqlClient.startConnection(mysqlClientConfig),
    );
    if (startConnectionError) return new Error('connectionError');

    const prevTableSchemaList = await generateTableSchemaList(mysqlClient);
    if (prevTableSchemaList instanceof Error) return prevTableSchemaList;

    const prevTableNameList = prevTableSchemaList.map((table) => table.name);

    upsertTables(tableSchemaList, prevTableNameList);

    const dropTablesError = await deleteTables(prevTableNameList, tableSchemaList, mysqlClient);
    if (dropTablesError) return dropTablesError;
  } catch (error) {
    console.error(error);
    return convertToErrorClass(error);
  } finally {
    mysqlClient.endConnection();
  }
};

/**
 * データベースにあり、スキーマにないtableを削除
 * @param {string[]}prevTableSchemaList - データベースに定義されているTableの名前
 * @param {string[]}currentTableNameList - スキーマに定義されているTableの名前
 * @param {MysqlClientInterface}mysqlClient
 */
const deleteTables = async (
  prevTableSchemaList: string[],
  currentTableSchemaList: TableSchema[],
  mysqlClient: MysqlClientInterface,
): Promise<void | Error> => {
  const currentTableNameList = currentTableSchemaList.map((table) => table.name);
  const tablesNamesToDelete: string[] = prevTableSchemaList.filter(
    (prevTableName) => !currentTableNameList.includes(prevTableName),
  );
  if (!tablesNamesToDelete.length) return;

  return await dropTablesQuery(tablesNamesToDelete, mysqlClient);
};

/**
 * スキーマに沿ってデータベースのテーブルを更新・作成
 * @param {TableSchema[]} currentTableSchemaList
 * @param {string[]} prevTableNameList
 */
const upsertTables = (currentTableSchemaList: TableSchema[], prevTableNameList: string[]): void => {
  const { tablesToCreate, tablesToUpdate } = currentTableSchemaList.reduce(
    (acc: { tablesToCreate: TableSchema[]; tablesToUpdate: TableSchema[] }, currentTable) => {
      if (prevTableNameList.includes(currentTable.name)) {
        // NOTE: tableSchemaListにあり、prevTableSchemaListにない場合
        acc.tablesToUpdate.push(currentTable);
      } else {
        // NOTE: tableSchemaListにあり、prevTableSchemaListにある場合
        acc.tablesToCreate.push(currentTable);
      }
      return acc;
    },
    {
      tablesToCreate: [],
      tablesToUpdate: [],
    },
  );

  console.log(
    '🚀 ~ file: migrationEntity.command.ts:35 ~ tablesToCreate:',
    tablesToCreate,
    tablesToUpdate,
  );
};
