export const PRIMITIVE_TYPE = {
  NUMBER: 'number',
  BIGINT: 'bigint',
  STRING: 'string',
  BOOLEAN: 'boolean',
  NULL: 'null',
  UNDEFINED: 'undefined',
  DATE: 'Date',
  UNKNOWN: 'unknown',
} as const;

export type PrimitiveTypeString = (typeof PRIMITIVE_TYPE)[keyof typeof PRIMITIVE_TYPE];
