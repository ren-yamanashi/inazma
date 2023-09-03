import {
  generateStringColumnDecorator,
  generateStringEnumAndColumnsFromSchema,
  generateStringFromSchema,
} from '../generateStringFromSchema';
import { ColumnSchema } from '../parseColumn';
import { toUpperCamelCase } from '../helpers/convertString';
import {
  columnIncludeEnumSchemasDummy,
  columnNotIncludeEnumSchemasDummy,
  columnSchemaDummy,
} from '../__mocks__/columnSchema.dummy';
import { TableSchema } from '../index';
import { tableSchemaDummy } from '../__mocks__/tableSchema.dummy';

describe('generateStringColumnDecorator', () => {
  it('正常に生成される(defaultValueの指定がない)', () => {
    // GIVEN: input(ColumnSchema)
    const columnSchema: ColumnSchema = columnSchemaDummy;

    // GIVEN: output(column)
    const column = `@Column({\ntype: \"bigint\",\ndefault: null,\nunsigned: true,\nunique: true,\nprimary: true\n})`;

    // WHEN
    const result = generateStringColumnDecorator(columnSchema);

    // THEN
    expect(result).toEqual(column);
  });

  it('正常に生成される(defaultValueの指定がある)', () => {
    // GIVEN: input(ColumnSchema)
    const columnSchema: ColumnSchema = columnSchemaDummy;

    // GIVEN: output(column)
    const column = `@Column({\ntype: \"bigint\",\ndefault: 0,\nunsigned: true,\nunique: true,\nprimary: true\n})`;

    // WHEN
    const result = generateStringColumnDecorator(columnSchema, '0');

    // THEN
    expect(result).toEqual(column);
  });
});

describe('generateStringEnumAndColumnsFromSchema', () => {
  it('enumとcolumnが正常に生成される', () => {
    // GIVEN: input(ColumnSchema[])
    const columnSchemas: ColumnSchema[] = columnIncludeEnumSchemasDummy;

    // GIVEN: output(columns)
    const columns = [
      `@Column({\ntype: \"bigint\",\ndefault: null,\nunsigned: true,\nunique: true,\nprimary: true\n})\nid: number;\n`,
      `@Column({\ntype: \"varchar(255)\",\ndefault: null,\nunsigned: false,\nunique: false,\nprimary: false\n})\ncontent: string | null;\n`,
      `@Column({\ntype: \"int\",\ndefault: 0,\nunsigned: true,\nunique: false,\nprimary: false\n})\norder: number;\n`,
      `@Column({\ntype: \"enum('active','inactive','deleted')\",\ndefault: Status.active,\nunsigned: false,\nunique: false,\nprimary: false\n})\nstatus: Status;\n`,
      `@Column({\ntype: \"datatime\",\ndefault: CURRENT_TIMESTAMP,\nunsigned: false,\nunique: false,\nprimary: false\n})\ncreatedDate: Date;\n`,
    ];
    // GIVEN: output(enums)
    const enums = [
      `enum Status {
active,
inactive,
deleted
};`,
    ];

    // WHEN
    const result = generateStringEnumAndColumnsFromSchema(columnSchemas, {
      toUpperCamelCase: toUpperCamelCase,
      generateStringColumnDecorator: generateStringColumnDecorator,
    });

    // THEN
    expect(result).toEqual({ columns, enums });
  });

  it('columnが正常に生成される', () => {
    // GIVEN: input(ColumnSchema[])
    const columnSchemas: ColumnSchema[] = columnNotIncludeEnumSchemasDummy;

    // GIVEN: output(columns)
    const columns = [
      `@Column({\ntype: \"bigint\",\ndefault: null,\nunsigned: true,\nunique: true,\nprimary: true\n})\nid: number;\n`,
      `@Column({\ntype: \"varchar(255)\",\ndefault: null,\nunsigned: false,\nunique: false,\nprimary: false\n})\ncontent: string | null;\n`,
      `@Column({\ntype: \"int\",\ndefault: 0,\nunsigned: true,\nunique: false,\nprimary: false\n})\norder: number;\n`,
      `@Column({\ntype: \"datatime\",\ndefault: CURRENT_TIMESTAMP,\nunsigned: false,\nunique: false,\nprimary: false\n})\ncreatedDate: Date;\n`,
    ];

    // WHEN
    const result = generateStringEnumAndColumnsFromSchema(columnSchemas, {
      toUpperCamelCase: toUpperCamelCase,
      generateStringColumnDecorator: generateStringColumnDecorator,
    });

    // THEN
    expect(result).toEqual({ columns, enums: [] });
  });
});

describe('generateStringFromSchema', () => {
  it('schemaが正常に生成される', () => {
    // GIVEN: input(TableSchema)
    const tableSchema: TableSchema = tableSchemaDummy;

    // GIVEN: output(table)
    const table = `enum Status {
active,
inactive,
deleted
};

class Sample {
@Column({
type: "bigint",
default: null,
unsigned: true,
unique: true,
primary: true
})
id: number;

@Column({
type: "varchar(255)",
default: null,
unsigned: false,
unique: false,
primary: false
})
content: string | null;

@Column({
type: "int",
default: 0,
unsigned: true,
unique: false,
primary: false
})
order: number;

@Column({
type: "enum('active','inactive','deleted')",
default: Status.active,
unsigned: false,
unique: false,
primary: false
})
status: Status;

@Column({
type: "datatime",
default: CURRENT_TIMESTAMP,
unsigned: false,
unique: false,
primary: false
})
createdDate: Date;

};
`;

    // WHEN
    const result = generateStringFromSchema([tableSchema], {
      toUpperCamelCase: toUpperCamelCase,
      generateStringEnumAndColumnsFromSchema: generateStringEnumAndColumnsFromSchema,
      generateStringColumnDecorator: generateStringColumnDecorator,
    });

    // THEN
    expect(result).toEqual(table);
  });
});
