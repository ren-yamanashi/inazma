import { IndexSchema } from '../types/schema.type';

export const indexSchemasDummy: IndexSchema[] = [
  {
    keyName: 'id_contents_idx',
    unique: false,
    columnNames: ['id', 'content'],
  },
];
