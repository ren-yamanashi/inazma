/* eslint-disable no-unsafe-finally */
import { container, fileSystemKey, mysqlClientKey } from '../di';
import {
  convertColumnExtraToColumnDecorator,
  generateStringColumnDecorator,
  generateStringEnumAndColumnsFromSchema,
  generateStringFromSchema,
} from '../generateStringFromSchema';
import { toUpperCamelCase } from '../helpers/convertString';
import { isArrayOfObjects } from '../helpers/typeCheck';
import { MysqlConnectionConfig } from '../interfaces/mysql.interface';
import { convertToPrimitiveTypeString, parseColumn } from '../parseColumn';
import { parseIndexes } from '../parseIndex';
import { showColumnsQuery } from '../queries/showColumns.query';
import { showIndexQuery } from '../queries/showIndex.query';
import { showTablesQuery } from '../queries/showTables.query';
import { TableSchema } from '../types/schema.type';

export const schemaGen = async (mysqlClientConfig: MysqlConnectionConfig): Promise<void> => {
  const mysqlClient = container.resolve(mysqlClientKey);
  const fs = container.resolve(fileSystemKey);

  try {
    mysqlClient.startConnection(mysqlClientConfig);

    // NOTE: table一覧の取得
    const tables = await showTablesQuery(mysqlClient, { isArrayOfObjects: isArrayOfObjects });
    if (tables instanceof Error) throw new Error('parseError');
    const tableSchemas: TableSchema[] = [];

    // NOTE: 取得したtable情報をもとにTableSchemaを生成
    for (const table of tables) {
      // NOTE: クエリの実行
      const indexes = await showIndexQuery(table.tableName, mysqlClient, {
        parseIndexes: parseIndexes,
        isArrayOfObjects: isArrayOfObjects,
      });
      if (indexes instanceof Error) throw new Error('parseError');

      const columns = await showColumnsQuery(table.tableName, mysqlClient, {
        parseColumn: parseColumn,
        isArrayOfObjects: isArrayOfObjects,
        convertTypeFn: convertToPrimitiveTypeString,
      });
      if (columns instanceof Error) throw new Error('parseError');

      // NOTE: table作成
      tableSchemas.push({ name: table.tableName, indexes, columns });
    }

    // NOTE: schemaの作成
    const stringSchema = generateStringFromSchema(tableSchemas, {
      toUpperCamelCase: toUpperCamelCase,
      generateStringEnumAndColumnsFromSchema: generateStringEnumAndColumnsFromSchema,
      generateStringColumnDecorator: generateStringColumnDecorator,
      convertColumnExtraToColumnDecorator: convertColumnExtraToColumnDecorator,
    });

    // NOTE: schemaの出力
    fs.writeFileSync('sample/db.schema.ts', stringSchema);
  } catch (error) {
    console.error(error);
  } finally {
    mysqlClient.endConnection();
  }
};
