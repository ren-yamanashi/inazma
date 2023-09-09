import { EnumSchema } from '../types/schema.type';

export const parseEnumFromString = (stringSchema: string): EnumSchema[] => {
  const ENUM_REGEXP = /enum\s+(\w+)\s*\{([^}]+)\}/g;
  const matches = [...stringSchema.matchAll(ENUM_REGEXP)];

  return matches.map((match) => {
    const name = match[1].toLowerCase();
    const values = match[2]
      .split(',')
      .map((v) => v.trim())
      .join(',');

    return {
      name,
      value: `enum(${values})`,
    };
  });
};
