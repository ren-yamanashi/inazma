import {
  columnIncludeEnumSchemasDummy,
  columnNotIncludeEnumSchemasDummy,
  columnSchemaDummy,
} from '../__mocks__/columnSchema.dummy';
import { tableSchemaDummy } from '../__mocks__/tableSchema.dummy';

import {
  convertColumnExtraToColumnDecorator,
  generateStringColumnDecorator,
  generateStringEnumAndColumnsFromSchema,
  generateStringFromSchema,
} from '../generateStringFromSchema';
import { toUpperCamelCase } from '../helpers/convertString';
import { COLUMN_EXTRA, ColumnExtra } from '../types/column.type';
import { COLUMN_DECORATOR, ColumnDecorator } from '../types/decorator.type';
import { ColumnSchema, TableSchema } from '../types/schema.type';

describe('convertColumnExtraToColumnDecorator', () => {
  it('extraが`auto_increment`の場合', () => {
    // GIVEN: input(ColumnExtra)
    const extra: ColumnExtra = COLUMN_EXTRA.AUTO_INCREMENT;

    // GIVEN: output(ColumnDecorator)
    const decorator: ColumnDecorator = COLUMN_DECORATOR.AUTO_INCREMENT_COLUMN;

    // WHEN
    const result = convertColumnExtraToColumnDecorator(extra);

    // THEN
    expect(result).toEqual(decorator);
  });

  it('extraが`DEFAULT_GENERATED`の場合', () => {
    // GIVEN: input(ColumnExtra)
    const extra: ColumnExtra = COLUMN_EXTRA.DEFAULT_GENERATED;

    // GIVEN: output(ColumnDecorator)
    const decorator: ColumnDecorator = COLUMN_DECORATOR.DEFAULT_GENERATED_COLUMN;

    // WHEN
    const result = convertColumnExtraToColumnDecorator(extra);

    // THEN
    expect(result).toEqual(decorator);
  });

  it('extraが`VIRTUAL GENERATED`の場合', () => {
    // GIVEN: input(ColumnExtra)
    const extra: ColumnExtra = COLUMN_EXTRA.VIRTUAL_GENERATED;

    // GIVEN: output(ColumnDecorator)
    const decorator: ColumnDecorator = COLUMN_DECORATOR.VIRTUAL_GENERATED_COLUMN;

    // WHEN
    const result = convertColumnExtraToColumnDecorator(extra);

    // THEN
    expect(result).toEqual(decorator);
  });

  it('extraが`STORED GENERATED`の場合', () => {
    // GIVEN: input(ColumnExtra)
    const extra: ColumnExtra = COLUMN_EXTRA.STORED_GENERATED;

    // GIVEN: output(ColumnDecorator)
    const decorator: ColumnDecorator = COLUMN_DECORATOR.STORED_GENERATED_COLUMN;

    // WHEN
    const result = convertColumnExtraToColumnDecorator(extra);

    // THEN
    expect(result).toEqual(decorator);
  });

  it('extraが`on update CURRENT_TIMESTAMP`の場合', () => {
    // GIVEN: input(ColumnExtra)
    const extra: ColumnExtra = COLUMN_EXTRA.ON_UPDATE_CURRENT_TIMESTAMP;

    // GIVEN: output(ColumnDecorator)
    const decorator: ColumnDecorator = COLUMN_DECORATOR.ON_UPDATE_CURRENT_TIMESTAMP_COLUMN;

    // WHEN
    const result = convertColumnExtraToColumnDecorator(extra);

    // THEN
    expect(result).toEqual(decorator);
  });

  it('extraが空文字の場合', () => {
    // GIVEN: input(ColumnExtra)
    const extra: ColumnExtra = COLUMN_EXTRA.NONE;

    // GIVEN: output(ColumnDecorator)
    const decorator: ColumnDecorator = COLUMN_DECORATOR.COLUMN;

    // WHEN
    const result = convertColumnExtraToColumnDecorator(extra);

    // THEN
    expect(result).toEqual(decorator);
  });
});

describe('generateStringColumnDecorator', () => {
  it('正常に生成される', () => {
    // GIVEN: input(ColumnSchema)
    const columnSchema: ColumnSchema = columnSchemaDummy;

    // GIVEN: output(column)
    const column = `@AutoIncrementColumn({\ntype: \"bigint\",\ndefault: null,\nunsigned: true,\nunique: true,\nprimary: true\n})`;

    // WHEN
    const result = generateStringColumnDecorator(columnSchema, columnSchema.defaultValue, {
      convertColumnExtraToColumnDecorator: convertColumnExtraToColumnDecorator,
    });

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
      `@AutoIncrementColumn({\ntype: \"bigint\",\ndefault: null,\nunsigned: true,\nunique: true,\nprimary: true\n})\nid: number;\n`,
      `@Column({\ntype: \"varchar(255)\",\ndefault: null,\nunsigned: false,\nunique: false,\nprimary: false\n})\ncontent: string | null;\n`,
      `@Column({\ntype: \"int\",\ndefault: 0,\nunsigned: true,\nunique: false,\nprimary: false\n})\norder: number;\n`,
      `@Column({\ntype: \"enum('active','inactive','deleted')\",\ndefault: Status.active,\nunsigned: false,\nunique: false,\nprimary: false\n})\nstatus: Status;\n`,
      `@DefaultGeneratedColumn({\ntype: \"datetime\",\ndefault: NOW(),\nunsigned: false,\nunique: false,\nprimary: false\n})\ncreatedDate: Date;\n`,
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
      convertColumnExtraToColumnDecorator: convertColumnExtraToColumnDecorator,
    });

    // THEN
    expect(result).toEqual({ columns, enums });
  });

  it('columnが正常に生成される', () => {
    // GIVEN: input(ColumnSchema[])
    const columnSchemas: ColumnSchema[] = columnNotIncludeEnumSchemasDummy;

    // GIVEN: output(columns)
    const columns = [
      `@AutoIncrementColumn({\ntype: \"bigint\",\ndefault: null,\nunsigned: true,\nunique: true,\nprimary: true\n})\nid: number;\n`,
      `@Column({\ntype: \"varchar(255)\",\ndefault: null,\nunsigned: false,\nunique: false,\nprimary: false\n})\ncontent: string | null;\n`,
      `@Column({\ntype: \"int\",\ndefault: 0,\nunsigned: true,\nunique: false,\nprimary: false\n})\norder: number;\n`,
      `@DefaultGeneratedColumn({\ntype: \"datetime\",\ndefault: NOW(),\nunsigned: false,\nunique: false,\nprimary: false\n})\ncreatedDate: Date;\n`,
    ];

    // WHEN
    const result = generateStringEnumAndColumnsFromSchema(columnSchemas, {
      toUpperCamelCase: toUpperCamelCase,
      generateStringColumnDecorator: generateStringColumnDecorator,
      convertColumnExtraToColumnDecorator: convertColumnExtraToColumnDecorator,
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

@Index("id_contents_idx", ["id", "content"], {
unique: false
})
@Entity("sample")
class Sample {
@AutoIncrementColumn({
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

@DefaultGeneratedColumn({
type: "datetime",
default: NOW(),
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
      convertColumnExtraToColumnDecorator: convertColumnExtraToColumnDecorator,
    });

    // THEN
    expect(result).toEqual(table);
  });
});
