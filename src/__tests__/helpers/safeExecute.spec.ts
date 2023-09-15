import { describe, expect, it } from 'vitest';
import { safeExecute, safeExecuteOfPromise } from '../../helpers/safeExecute';

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
