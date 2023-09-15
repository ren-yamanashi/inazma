import { describe, expect, it } from 'vitest';
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
    const error: Error = convertToErrorClass(err);
    return { error };
  }
};

/**
 *
 * test
 *
 */
describe('safeExecuteOfPromise', () => {
  it('非同期関数が成功した場合はデータを返す', async () => {
    // GIVEN input(Promise)
    const asyncFunc = () => Promise.resolve('test');

    // WHEN
    const result = await safeExecuteOfPromise(asyncFunc);

    // THEN
    expect(result).toHaveProperty('data', 'test');
    expect(result).not.toHaveProperty('error');
  });

  it('非同期関数がthrowされるとエラーを返す', async () => {
    // GIVEN: input(throwする関数)
    const errorMessage = 'Test error';
    const asyncFunc = () => {
      throw new Error(errorMessage);
    };

    // WHEN
    const result = await safeExecuteOfPromise(asyncFunc);

    // THEN
    expect(result).toHaveProperty('error');
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error?.message).toBe(errorMessage);
    expect(result).not.toHaveProperty('data');
  });
});

describe('safeExecute', () => {
  it('関数が成功した場合はデータを返す', () => {
    // GIVEN input(() => string)
    const func = () => 'test';

    // WHEN
    const result = safeExecute(func);

    // THEN
    expect(result).toHaveProperty('data', 'test');
    expect(result).not.toHaveProperty('error');
  });

  it('関数がthrowされるとエラーを返す', () => {
    // GIVEN: input(throwする関数)
    const errorMessage = 'Test error';
    const func = () => {
      throw new Error(errorMessage);
    };

    // WHEN
    const result = safeExecute(func);

    // THEN
    expect(result).toHaveProperty('error');
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error?.message).toBe(errorMessage);
    expect(result).not.toHaveProperty('data');
  });
});
