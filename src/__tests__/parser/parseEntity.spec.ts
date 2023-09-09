import { stringEntityDecoratorDummy } from '../../__mocks__/stringEntityDecorator.dummy';
import { stringSchemaDummy } from '../../__mocks__/stringSchema.dummy';
import { parseEntityDecoratorFromString } from '../../parser/parseEntity';
import { TableSchema } from '../../types/schema.type';

describe('parseEntityDecoratorFromString', () => {
  it('正常に解析される(inputの文字列が@Entityデコレーターのみ)', () => {
    // GIVEN: input(string)
    const stringEntityDecorator = stringEntityDecoratorDummy;

    // GIVEN: output(TableSchema[])
    const tableSchemas: TableSchema[] = [
      {
        name: 'sample',
        database: 'sample',
        columns: [],
        indexes: [],
      },
      {
        name: 'student',
        database: 'user',
        columns: [],
        indexes: [],
      },
    ];

    // WHEN
    const result = parseEntityDecoratorFromString(stringEntityDecorator);

    // THEN
    expect(result).toEqual(tableSchemas);
  });

  it('正常に解析される(inputの文字列に@Entityデコレーター以外も含む)', () => {
    // GIVEN: input(string)
    const stringSchema = stringSchemaDummy;

    // GIVEN: output(TableSchema[])
    const tableSchemas: TableSchema[] = [
      {
        name: 'sample',
        database: 'sample',
        columns: [],
        indexes: [],
      },
      {
        name: 'triangle',
        database: 'sample',
        columns: [],
        indexes: [],
      },
    ];

    // WHEN
    const result = parseEntityDecoratorFromString(stringSchema);

    // THEN
    expect(result).toEqual(tableSchemas);
  });
});
