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
import { TableSchema } from '../types/schema.type';

export const schemaGen = async (mysqlClientConfig: MysqlConnectionConfig): Promise<void> => {
  const mysqlClient = container.resolve(mysqlClientKey);
  const fs = container.resolve(fileSystemKey);

  try {
    mysqlClient.startConnection(mysqlClientConfig);

    // NOTE: table一覧の取得
    const tables = await mysqlClient.queryAsync('SHOW TABLES');
    if (!Array.isArray(tables)) return;
    const tableNames = tables.map((val) => Object.values(val)).flat();
    const tableSchemas: TableSchema[] = [];

    // NOTE: 取得したtable情報をもとにTableSchemaを生成
    for (const tableName of tableNames) {
      if (typeof tableName !== 'string') continue;

      // NOTE: クエリの実行
      const indexes = await showIndexQuery(tableName, mysqlClient, {
        parseIndexes: parseIndexes,
        isArrayOfObjects: isArrayOfObjects,
      });
      // TODO: エラーハンドリングを考える
      if (indexes instanceof Error) throw new Error('parseError');

      const columns = await showColumnsQuery(tableName, mysqlClient, {
        parseColumn: parseColumn,
        isArrayOfObjects: isArrayOfObjects,
        convertTypeFn: convertToPrimitiveTypeString,
      });
      // TODO: エラーハンドリングを考える
      if (columns instanceof Error) throw new Error('parseError');

      // NOTE: table作成
      tableSchemas.push({ name: tableName, indexes, columns });
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
