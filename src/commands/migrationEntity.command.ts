import { container, fileSystemKey } from '../di';
import { parseEntityDecoratorFromString } from '../parser/parseEntity';
import { parseEnumFromString } from '../parser/parseEnum';
import { parseIndexDecoratorFromString } from '../parser/parseIndex';
import { EnumSchema, IndexSchema, TableSchema } from '../types/schema.type';

export const migrationEntity = (
  //   mysqlCLientConfig: MysqlConnectionConfig,
  entityFile = 'sample/db.schema.ts',
): void | Error => {
  //   const mysqlClient = container.resolve(mysqlClientKey);
  const fs = container.resolve(fileSystemKey);
  const stringSchema = fs.readFileSync(entityFile, { encoding: 'utf-8' }).toString();

  const enumSchemas: EnumSchema[] = parseEnumFromString(stringSchema);
  const indexSchemas: IndexSchema[] = parseIndexDecoratorFromString(stringSchema);
  const tableSchemas: TableSchema[] = parseEntityDecoratorFromString(stringSchema);

  console.log(
    '🚀 ~ file: migrationEntity.command.ts:16 ~ enumSchemas:',
    enumSchemas,
    indexSchemas,
    tableSchemas,
  );
};
