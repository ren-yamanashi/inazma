import { container, mysqlClientKey } from '../di';
import { generateTableSchemaList } from '../generateTableSchemaList';
import { convertToErrorClass } from '../helpers/convert';
import { safeExecute } from '../helpers/safeExecute';
import { isArrayOfObjects } from '../helpers/typeCheck';
import { MysqlClientInterface, MysqlConnectionConfig } from '../interfaces/mysql.interface';
import { parseColumn, parseToPrimitiveTypeString } from '../parser/parseColumn';
import { parseIndexes } from '../parser/parseIndex';
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

    const prevTableSchemaList = await generateTableSchemaList(mysqlClient, {
      isArrayOfObjects: isArrayOfObjects,
      parseIndexes: parseIndexes,
      convertToErrorClass: convertToErrorClass,
      parseToPrimitiveTypeString: parseToPrimitiveTypeString,
      parseColumn: parseColumn,
    });
    if (prevTableSchemaList instanceof Error) return prevTableSchemaList;

    const currentTableNameList = tableSchemaList.map((table) => table.name);
    const prevTableNameList = prevTableSchemaList.map((table) => table.name);

    const { tablesToCreate, tablesToUpdate } = tableSchemaList.reduce(
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

    const dropTablesError = await deleteTables(
      prevTableNameList,
      currentTableNameList,
      mysqlClient,
    );
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
  currentTableNameList: string[],
  mysqlClient: MysqlClientInterface,
): Promise<void | Error> => {
  const tablesNamesToDelete: string[] = prevTableSchemaList.filter(
    (prevTableName) => !currentTableNameList.includes(prevTableName),
  );
  if (!tablesNamesToDelete.length) return;

  return await dropTablesQuery(tablesNamesToDelete, mysqlClient);
};
