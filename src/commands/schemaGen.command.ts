import { container, fileSystemKey, mysqlClientKey } from '../di';
import { generateStringFromSchema } from '../generators/generateStringFromSchema';
import { generateTableSchemaList } from '../generators/generateTableSchemaList';
import { convertToErrorClass } from '../helpers/convert';
import { safeExecute } from '../helpers/safeExecute';
import { MysqlConnectionConfig } from '../interfaces/mysql.interface';

export const schemaGen = async (
  mysqlClientConfig: MysqlConnectionConfig,
  outputFile = '.out/db.schema.ts',
): Promise<void | Error> => {
  const mysqlClient = container.resolve(mysqlClientKey);
  const fs = container.resolve(fileSystemKey);

  try {
    const { error: startConnectionError } = safeExecute(() =>
      mysqlClient.startConnection(mysqlClientConfig),
    );
    if (startConnectionError) throw new Error('connectionError');

    const tableSchemas = await generateTableSchemaList(mysqlClient);
    if (tableSchemas instanceof Error) throw tableSchemas;

    // NOTE: schema作成
    const stringSchema = generateStringFromSchema(tableSchemas);

    // NOTE: schema出力
    const { error: writeFileError } = safeExecute(() => fs.writeFileSync(outputFile, stringSchema));
    if (writeFileError) throw new Error('writeFileError');
  } catch (error) {
    console.error(error);
    return convertToErrorClass(error);
  } finally {
    mysqlClient.endConnection();
  }
};
