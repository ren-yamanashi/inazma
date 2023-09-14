import { IndexSchema } from '../types/schema.type';

export interface ParseIndexes {
  (args: { [key: string]: unknown }[]): IndexSchema[];
}

export const parseIndexes = (args: { [key: string]: unknown }[]): IndexSchema[] => {
  const KEY_NAME_PROPERTY = 'Key_name';
  const COLUMN_NAME_PROPERTY = 'Column_name';
  const NON_UNIQUE_PROPERTY = 'Non_unique';
  const KEY_NAME_PRIMARY = 'PRIMARY';
  const indexes: { [key: string]: IndexSchema } = {};

  for (const arg of args) {
    if (
      !(KEY_NAME_PROPERTY in arg) ||
      !(COLUMN_NAME_PROPERTY in arg) ||
      !(NON_UNIQUE_PROPERTY in arg) ||
      typeof arg[KEY_NAME_PROPERTY] !== 'string' ||
      typeof arg[COLUMN_NAME_PROPERTY] !== 'string' ||
      typeof arg[NON_UNIQUE_PROPERTY] !== 'number'
    ) {
      continue;
    }

    const keyName = arg[KEY_NAME_PROPERTY];
    const columnName = arg[COLUMN_NAME_PROPERTY];
    const nonUnique = arg[NON_UNIQUE_PROPERTY];

    if (keyName === KEY_NAME_PRIMARY || keyName === columnName) continue;

    if (!indexes[keyName]) {
      indexes[keyName] = {
        keyName: keyName,
        unique: nonUnique === 0,
        columnNames: [],
      };
    }

    if (!indexes[keyName].columnNames.includes(columnName)) {
      indexes[keyName].columnNames.push(columnName);
    }
  }

  return Object.values(indexes);
};
