import { convertToErrorClass } from './convert';

type SafeExecuteResult<T> = {
  data?: T;
  error?: Error;
};

export const safeExecute = <T>(func: () => T): SafeExecuteResult<T> => {
  try {
    return {
      data: func(),
    };
  } catch (err: unknown) {
    const error: Error = convertToErrorClass(err);
    return { error };
  }
};
export const safeExecuteOfPromise = async <T>(
  asyncFunc: () => Promise<T>,
): Promise<SafeExecuteResult<T>> => {
  try {
    const data = await asyncFunc();
    return {
      data,
    };
  } catch (err: unknown) {
    console.error(err);
    const error: Error = convertToErrorClass(err);
    return { error };
  }
};
