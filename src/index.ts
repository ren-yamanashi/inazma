import * as fs from 'fs';
import * as mysql from 'mysql';
import { ColumnSchema, convertToPrimitiveTypeString, parseColumn } from './parseColumn';
import { IndexSchema, parseIndexes } from './parseIndex';
import {
  generateStringFromSchema,
  generateStringEnumAndColumnsFromSchema,
} from './generateStringFromSchema';
import { toUpperCamelCase } from './helpers/convertString';

export type TableSchema = {
  name: string;
  columns: ColumnSchema[];
  indexes: IndexSchema[];
};

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'sample',
});

/**
 * 非同期にsqlクエリを実行し、その結果を返す
 * @param {string} sql
 * @param {unknown[]} values sqlの `??` にあてはめる値
 * @returns {Promise<unknown>} クエリの実行結果
 */
const queryAsync = async (sql: string, values: unknown[] = []): Promise<unknown> =>
  new Promise((resolve, reject) => {
    connection.query(sql, values, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });

/**
 * 文字列形式のschemaをfileに書き込む
 * @param {string} stringSchema - 文字列形式のschema
 * @param {string} fileName - file名
 */
export const writeSchemaFile = (stringSchema: string, fileName: string): void => {
  try {
    fs.writeFileSync(fileName, stringSchema);
  } catch (err: unknown) {
    console.error(`Error writing to file: ${err}`);
  }
};

const main = async () => {
  try {
    const tables = await queryAsync('SHOW TABLES');
    if (!Array.isArray(tables)) return;
    const tableNames = tables.map((val) => Object.values(val)).flat();
    const tableSchemas: TableSchema[] = [];

    for (const tableName of tableNames) {
      if (typeof tableName !== 'string') continue;

      // NOTE: クエリの実行
      const indexes = await queryAsync('SHOW INDEX FROM ??', [tableName]);
      const columns = await queryAsync('SHOW COLUMNS FROM ??', [tableName]);
      if (!Array.isArray(columns) || !Array.isArray(indexes)) continue;

      // NOTE: クエリの結果をparse
      const parsedIndexes = parseIndexes(indexes);
      const parsedColumns = columns.map((column) =>
        parseColumn(column, { convertTypeFn: convertToPrimitiveTypeString }),
      );

      // NOTE: table作成
      tableSchemas.push({ name: tableName, indexes: parsedIndexes, columns: parsedColumns });
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
