import * as mysql from 'mysql';
import { convertToPrimitiveTypeString, parseColumn } from './parseColumn';
import { parseIndexes } from './parseIndex';
import { TableSchema, createTable } from './createTable';
import {
  generateStringFromSchema,
  generateStringEnumAndColumnsFromSchema,
  writeSchemaFile,
} from './generateStringFromSchema';
import { toUpperCamelCase } from './helpers/convertString';

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'sample',
});

const queryAsync = async (sql: string, values: unknown[] = []): Promise<unknown> =>
  new Promise((resolve, reject) => {
    connection.query(sql, values, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });

const main = async () => {
  try {
    const tables = await queryAsync('SHOW TABLES');
    if (!Array.isArray(tables)) return;
    const tableNames = tables.map((val) => Object.values(val)).flat();
    const tableSchemas: TableSchema[] = [];

    for (const tableName of tableNames) {
      if (typeof tableName !== 'string') continue;

      // NOTE: クエリの実行
      const columns = await queryAsync('SHOW COLUMNS FROM ??', [tableName]);
      const indexes = await queryAsync('SHOW INDEX FROM ??', [tableName]);
      if (!Array.isArray(columns) || !Array.isArray(indexes)) continue;

      // NOTE: クエリの結果をparse
      const parsedColumns = columns.map((column) =>
        parseColumn(column, { convertTypeFn: convertToPrimitiveTypeString }),
      );
      const parsedIndexes = parseIndexes(indexes);

      // NOTE: table作成
      tableSchemas.push(createTable(tableName, parsedColumns, parsedIndexes));
    }

    // NOTE: schemaの作成
    const stringSchema = generateStringFromSchema(tableSchemas, {
      toUpperCamelCase: toUpperCamelCase,
      generateStringEnumAndColumnsFromSchema: generateStringEnumAndColumnsFromSchema,
    });

    // NOTE: schemaの出力
    writeSchemaFile(stringSchema, 'sample/db.schema.ts');
  } catch (error) {
    console.error(error);
  } finally {
    connection.end();
  }
};

main();
