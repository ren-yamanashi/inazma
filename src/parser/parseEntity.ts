import { TableSchema } from '../types/schema.type';

export const parseEntityDecoratorFromString = (stringSchema: string): TableSchema[] => {
  const ENTITY_REGEXP = /@Entity\("(\w+)", \{[\s]*database: "(\w+)"[\s]*\}\)/g;
  const matches = [...stringSchema.matchAll(ENTITY_REGEXP)];

  return matches.map((match) => {
    const name = match[1];
    const database = match[2];

    return {
      name,
      database,
      columns: [],
      indexes: [],
    };
  });
};
