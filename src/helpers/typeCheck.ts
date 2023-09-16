export const isArrayOfObjects = (arg: unknown): arg is { [key: string]: unknown }[] => {
  if (!Array.isArray(arg)) return false;
  return arg.every((item) => typeof item === 'object' && item !== null);
};

export const isIncludeMessage = (arg: unknown): arg is { message: string } =>
  arg !== null &&
  typeof arg === 'object' &&
  'message' in arg &&
  typeof (arg as { message: unknown }).message === 'string';
