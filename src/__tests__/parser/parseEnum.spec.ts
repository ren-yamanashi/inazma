import { stringEnumDummy } from '../../__mocks__/stringEnum.dummy';
import { stringSchemaDummy } from '../../__mocks__/stringSchema.dummy';
import { parseEnumFromString } from '../../parser/parseEnum';
import { EnumSchema } from '../../types/schema.type';

describe('parseEnumFromString', () => {
  it('正常に解析される(inputの文字列がenumのみ)', () => {
    // GIVEN: input(string)
    const stringEnum = stringEnumDummy;

    // GIVEN: output(EnumSchema)
    const enumSchema: EnumSchema[] = [
      {
        name: 'status',
        value: 'enum(active,inactive,deleted)',
      },
      {
        name: 'color',
        value: 'enum(red,green,blue)',
      },
    ];

    // WHEN
    const result = parseEnumFromString(stringEnum);

    // THEN
    expect(result).toEqual(enumSchema);
  });

  it('正常に解析される(inputの文字列にenum以外も含む)', () => {
    // GIVEN: input(string)
    const stringSchema = stringSchemaDummy;

    // GIVEN: output(EnumSchema)
    const enumSchema: EnumSchema[] = [
      {
        name: 'status',
        value: 'enum(active,inactive,deleted)',
      },
    ];

    // WHEN
    const result = parseEnumFromString(stringSchema);

    // THEN
    expect(result).toEqual(enumSchema);
  });
});
