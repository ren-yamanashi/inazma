import { container, fileSystemKey, mysqlClientKey } from '../di';
import {
  generateStringEnumAndColumnsFromSchema,
  generateStringFromSchema,
} from '../generateStringFromSchema';
import { generateTableSchemaList } from '../generateTableSchemaList';
import { convertToErrorClass, toUpperCamelCase } from '../helpers/convert';
import { safeExecute } from '../helpers/safeExecute';
import { isArrayOfObjects } from '../helpers/typeCheck';
import { MysqlConnectionConfig } from '../interfaces/mysql.interface';
import { parseColumn, parseToPrimitiveTypeString } from '../parser/parseColumn';
import { parseIndexes } from '../parser/parseIndex';

export const schemaGen = async (
  mysqlClientConfig: MysqlConnectionConfig,
  outputFile = 'sample/db.schema.ts',
): Promise<void | Error> => {
  const mysqlClient = container.resolve(mysqlClientKey);
  const fs = container.resolve(fileSystemKey);

  try {
    const { error: startConnectionError } = safeExecute(() =>
      mysqlClient.startConnection(mysqlClientConfig),
    );
    if (startConnectionError) return new Error('connectionError');

    const tableSchemas = await generateTableSchemaList(mysqlClient, {
      isArrayOfObjects: isArrayOfObjects,
      parseIndexes: parseIndexes,
      convertToErrorClass: convertToErrorClass,
      parseToPrimitiveTypeString: parseToPrimitiveTypeString,
      parseColumn: parseColumn,
    });
    if (tableSchemas instanceof Error) return tableSchemas;

    // NOTE: schema作成
    const stringSchema = generateStringFromSchema(tableSchemas, {
      toUpperCamelCase: toUpperCamelCase,
      generateStringEnumAndColumnsFromSchema: generateStringEnumAndColumnsFromSchema,
    });

    // NOTE: schema出力
    const { error: writeFileError } = safeExecute(() => fs.writeFileSync(outputFile, stringSchema));
    if (writeFileError) return new Error('writeFileError');
  } catch (error) {
    console.error(error);
    return convertToErrorClass(error);
  } finally {
    mysqlClient.endConnection();
  }
};
