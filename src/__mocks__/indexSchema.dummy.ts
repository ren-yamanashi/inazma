import { IndexSchema } from '../types/schema.type';

export const indexSchemasDummy: IndexSchema[] = [
  { keyName: 'PRIMARY', unique: true, columnNames: ['id'] },
  { keyName: 'id', unique: true, columnNames: ['id'] },
  {
    keyName: 'id_contents_idx',
    unique: false,
    columnNames: ['id', 'content'],
  },
];
