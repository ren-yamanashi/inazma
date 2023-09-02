import { IndexSchema } from '../parseIndex';

export const indexSchemasDummy: IndexSchema[] = [
  { keyName: 'PRIMARY', unique: true, columnNames: ['id'] },
  { keyName: 'id', unique: true, columnNames: ['id'] },
  {
    keyName: 'id_contents_idx',
    unique: false,
    columnNames: ['id', 'content'],
  },
];
