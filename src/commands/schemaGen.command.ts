import { container, fileSystemKey, mysqlClientKey } from '../di';
import {
  convertColumnExtraToColumnDecorator,
  generateStringColumnDecorator,
  generateStringEnumAndColumnsFromSchema,
  generateStringFromSchema,
} from '../generateStringFromSchema';
import { toUpperCamelCase } from '../helpers/convert';
import { safeExecute } from '../helpers/safeExecute';
import { isArrayOfObjects } from '../helpers/typeCheck';
import { MysqlConnectionConfig } from '../interfaces/mysql.interface';
import { parseColumn, parseToPrimitiveTypeString } from '../parser/parseColumn';
import { parseIndexes } from '../parser/parseIndex';
import { showColumnsQuery } from '../queries/showColumns.query';
import { showIndexQuery } from '../queries/showIndex.query';
import { showTablesQuery } from '../queries/showTables.query';
import { TableSchema } from '../types/schema.type';

export const schemaGen = async (
  mysqlClientConfig: MysqlConnectionConfig,
  outputFile = 'sample/db.schema.ts',
): Promise<void | Error> => {
  const mysqlClient = container.resolve(mysqlClientKey);
  const fs = container.resolve(fileSystemKey);
  const tableSchemas: TableSchema[] = [];
  try {
    const { error: startConnectionError } = safeExecute(() =>
      mysqlClient.startConnection(mysqlClientConfig),
    );
    if (startConnectionError) return new Error('connectionError');

    // NOTE: table一覧の取得
    const tables = await showTablesQuery(mysqlClient, { isArrayOfObjects: isArrayOfObjects });
    if (tables instanceof Error) return new Error('parseError');

    for (const table of tables) {
      // NOTE: index一覧の取得
      const indexes = await showIndexQuery(table.tableName, mysqlClient, {
        parseIndexes: parseIndexes,
        isArrayOfObjects: isArrayOfObjects,
      });
      if (indexes instanceof Error) return new Error('parseError');

      // NOTE: column一覧の取得
      const columns = await showColumnsQuery(table.tableName, mysqlClient, {
        parseColumn: parseColumn,
        isArrayOfObjects: isArrayOfObjects,
        convertTypeFn: parseToPrimitiveTypeString,
      });
      if (columns instanceof Error) return new Error('parseError');

      tableSchemas.push({ database: table.databaseName, name: table.tableName, indexes, columns });
    }

    // NOTE: schema作成
    const stringSchema = generateStringFromSchema(tableSchemas, {
      toUpperCamelCase: toUpperCamelCase,
      generateStringEnumAndColumnsFromSchema: generateStringEnumAndColumnsFromSchema,
      generateStringColumnDecorator: generateStringColumnDecorator,
      convertColumnExtraToColumnDecorator: convertColumnExtraToColumnDecorator,
    });

    // NOTE: schema出力
    const { error: writeFileError } = safeExecute(() => fs.writeFileSync(outputFile, stringSchema));
    if (writeFileError) return new Error('writeFileError');

    const { error: endConnectionError } = safeExecute(mysqlClient.endConnection);
    if (endConnectionError) return new Error('endConnectionError');
  } catch (error) {
    console.error(error);
  } finally {
    mysqlClient.endConnection();
  }
};
