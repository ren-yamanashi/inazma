export const isArrayOfObjects = (arg: unknown): arg is { [key: string]: unknown }[] => {
  if (!Array.isArray(arg)) return false;
  return arg.every((item) => typeof item === 'object' && item !== null);
};
