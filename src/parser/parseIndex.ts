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

export const parseIndexDecoratorFromString = (stringSchema: string): IndexSchema[] => {
  const INDEX_REGEXP = /@Index\("(\w+)", \[([\w\s",]+)\], \{[\s]*unique: (true|false)[\s]*\}\)/g;
  const matches = [...stringSchema.matchAll(INDEX_REGEXP)];

  return matches.map((match) => {
    const keyName = match[1];
    const columnNames = match[2].split(',').map((v) => v.trim().replace(/"/g, ''));
    const unique = match[3] === 'true';

    return {
      keyName,
      columnNames,
      unique,
    };
  });
};
