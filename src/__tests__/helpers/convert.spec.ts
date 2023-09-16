import { convertToErrorClass, toUpperCamelCase } from '../../helpers/convert';

describe('toUpperCamelCase', () => {
  it('正常に変換される(LowerCase)', () => {
    // GIVEN: input(LowerCase)
    const arg = 'sample';

    // GIVEN: output(UpperCamelCase)
    const expectedValue = 'Sample';

    // WHEN
    const result = toUpperCamelCase(arg);

    // THEN
    expect(result).toEqual(expectedValue);
  });

  it('正常に変換される(LowerCamelCase)', () => {
    // GIVEN: input(LowerCase)
    const arg = 'sampleValue';

    // GIVEN: output(UpperCamelCase)
    const expectedValue = 'SampleValue';

    // WHEN
    const result = toUpperCamelCase(arg);

    // THEN
    expect(result).toEqual(expectedValue);
  });
});

describe('convertToErrorClass', () => {
  it('引数が既にErrorのインスタンスである場合は、同じインスタンスを返す', () => {
    // GIVEN: input(Error)
    const error = new Error('Existing error');

    // WHEN
    const result = convertToErrorClass(error);

    // THEN
    expect(result).toBe(error);
  });

  it('引数が文字列の場合、messageプロパティの値がその文字列であるErrorインスタンスを返す', () => {
    // GIVEN: input(string)
    const error = 'Error message';

    // WHEN
    const result = convertToErrorClass(error);

    // THEN
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe(error);
  });

  it('引数がmessageプロパティを持つオブジェクトの場合、そのプロパティがErrorインスタンスのmessageプロパティになる', () => {
    // GIVEN: input(`{message: string}`)
    const error = { message: 'Error message' };

    // WHEN
    const result = convertToErrorClass(error);

    // THEN
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe(error.message);
  });

  it('引数がメッセージプロパティをモナたいオブジェクトの場合、文字列化されたオブジェクトをメッセージとして使用したErrorインスタンスを返す', () => {
    // GIVEN: input(object)
    const error = { key: 'value' };

    // WHEN
    const result = convertToErrorClass(error);

    // THEN
    expect(result).toBeInstanceOf(Error);
  });
});
