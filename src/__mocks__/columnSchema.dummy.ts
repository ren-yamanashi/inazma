import { ColumnSchema } from '../types/schema.type';

export const columnSchemaDummy: ColumnSchema = {
  field: 'id',
  typeInDb: 'bigint',
  typeInTs: 'number',
  nullable: false,
  key: 'PRI',
  unsigned: true,
  defaultValue: null,
  extra: 'auto_increment',
};

export const columnIncludeEnumSchemasDummy: ColumnSchema[] = [
  {
    field: 'id',
    typeInDb: 'bigint',
    typeInTs: 'number',
    nullable: false,
    key: 'PRI',
    unsigned: true,
    defaultValue: null,
    extra: 'auto_increment',
  },
  {
    field: 'content',
    typeInDb: 'varchar(255)',
    typeInTs: 'string',
    nullable: true,
    key: '',
    unsigned: false,
    defaultValue: null,
    extra: '',
  },
  {
    field: 'order',
    typeInDb: 'int',
    typeInTs: 'number',
    nullable: false,
    key: '',
    unsigned: true,
    defaultValue: '0',
    extra: '',
  },
  {
    field: 'status',
    typeInTs: "enum('active','inactive','deleted')",
    typeInDb: "enum('active','inactive','deleted')",
    nullable: false,
    key: '',
    unsigned: false,
    defaultValue: 'active',
    extra: '',
  },
  {
    field: 'createdDate',
    typeInDb: 'datetime',
    typeInTs: 'Date',
    nullable: false,
    key: '',
    unsigned: false,
    defaultValue: 'NOW()',
    extra: 'DEFAULT_GENERATED',
  },
];

export const columnNotIncludeEnumSchemasDummy: ColumnSchema[] = [
  {
    field: 'id',
    typeInDb: 'bigint',
    typeInTs: 'number',
    nullable: false,
    key: 'PRI',
    unsigned: true,
    defaultValue: null,
    extra: 'auto_increment',
  },
  {
    field: 'content',
    typeInDb: 'varchar(255)',
    typeInTs: 'string',
    nullable: true,
    key: '',
    unsigned: false,
    defaultValue: null,
    extra: '',
  },
  {
    field: 'order',
    typeInDb: 'int',
    typeInTs: 'number',
    nullable: false,
    key: '',
    unsigned: true,
    defaultValue: '0',
    extra: '',
  },
  {
    field: 'createdDate',
    typeInDb: 'datetime',
    typeInTs: 'Date',
    nullable: false,
    key: '',
    unsigned: false,
    defaultValue: 'NOW()',
    extra: 'DEFAULT_GENERATED',
  },
];
