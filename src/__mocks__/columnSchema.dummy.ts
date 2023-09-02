import { ColumnSchema } from '../parseColumn';

export const columnIncludeEnumSchemasDummy: ColumnSchema[] = [
  {
    field: 'id',
    type: 'number',
    nullable: false,
    key: 'PRI',
    defaultValue: null,
    extra: 'auto_increment',
  },
  {
    field: 'content',
    type: 'string',
    nullable: true,
    key: '',
    defaultValue: null,
    extra: '',
  },
  {
    field: 'order',
    type: 'number',
    nullable: false,
    key: '',
    defaultValue: '0',
    extra: '',
  },
  {
    field: 'status',
    type: "enum('active','inactive','deleted')",
    nullable: false,
    key: '',
    defaultValue: 'active',
    extra: '',
  },
  {
    field: 'createdDate',
    type: 'Date',
    nullable: false,
    key: '',
    defaultValue: 'CURRENT_TIMESTAMP',
    extra: 'DEFAULT_GENERATED',
  },
];

export const columnNotIncludeEnumSchemasDummy: ColumnSchema[] = [
  {
    field: 'id',
    type: 'number',
    nullable: false,
    key: 'PRI',
    defaultValue: null,
    extra: 'auto_increment',
  },
  {
    field: 'content',
    type: 'string',
    nullable: true,
    key: '',
    defaultValue: null,
    extra: '',
  },
  {
    field: 'order',
    type: 'number',
    nullable: false,
    key: '',
    defaultValue: '0',
    extra: '',
  },
  {
    field: 'createdDate',
    type: 'Date',
    nullable: false,
    key: '',
    defaultValue: 'CURRENT_TIMESTAMP',
    extra: 'DEFAULT_GENERATED',
  },
];
