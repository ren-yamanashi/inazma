import { describe, expect, it } from 'vitest';

export const isArrayOfObjects = (arg: unknown): arg is { [key: string]: unknown }[] => {
  if (!Array.isArray(arg)) return false;
  return arg.every((item) => typeof item === 'object' && item !== null);
};

export const isIncludeMessage = (arg: unknown): arg is { message: string } =>
  arg !== null &&
  typeof arg === 'object' &&
  'message' in arg &&
  typeof (arg as { message: unknown }).message === 'string';

/**
 *
 * test
 *
 */
describe('isArrayOfObjects', () => {
  it('オブジェクトの配列の場合はtrueを返す', () => {
    // GIVEN: input(object[])
    const data = [{ key: 'value' }, { anotherKey: 123 }];

    // WHEN
    const result = isArrayOfObjects(data);

    // THEN
    expect(result).toEqual(true);
  });

  it('オブジェクトではない配列の場合はfalseを返す', () => {
    // GIVEN: input(not object array)
    const data = [123, 'string'];

    // WHEN
    const result = isArrayOfObjects(data);

    // THEN
    expect(result).toEqual(false);
  });

  it('配列ではない場合はfalseを返す', () => {
    // GIVEN: input(object)
    const data = { key: 'value' };

    // WHEN
    const result = isArrayOfObjects(data);

    // THEN
    expect(result).toEqual(false);
  });

  it('nullやundefinedの場合はfalseを返す', () => {
    // GIVEN: input(null)
    const nullData = null;

    // GIVEN: input(undefined)
    const undefinedData = undefined;

    // WHEN
    const result1 = isArrayOfObjects(nullData);
    const result2 = isArrayOfObjects(undefinedData);

    // THEN
    expect(result1).toEqual(false);
    expect(result2).toEqual(false);
  });
});

describe('isIncludeMessage', () => {
  it('文字列型のmessageプロパティを持つ場合はtrue', () => {
    // GIVEN: input(文字列型のmessageを持つオブジェクト)
    const arg = {
      message: 'test',
      otherProperty: 42,
    };

    // WHEN
    const result = isIncludeMessage(arg);

    // THEN
    expect(result).toEqual(true);
  });

  it('messageプロパティのないオブジェクトの場合はfalse', () => {
    // GIVEN: input(messageプロパティを持たないオブジェクト)
    const arg = {
      otherProperty: 42,
    };

    // WHEN
    const result = isIncludeMessage(arg);

    // THEN
    expect(result).toEqual(false);
  });

  it('オブジェクトでない場合はfalse', () => {
    // GIVEN: input(string)
    const arg = 'I am not an object';

    // WHEN
    const result = isIncludeMessage(arg);

    // THEN
    expect(result).toEqual(false);
  });

  it('文字列型でないmessageプロパティを持つ場合はfalse', () => {
    // GIVEN: input(文字列型でないmessageを持つオブジェクト)
    const arg = {
      message: 42,
    };

    // WHEN
    const result = isIncludeMessage(arg);

    // THEN
    expect(result).toEqual(false);
  });
});
