import { describe, expect, it } from 'vitest';

type Handler<T> = () => T;

class Match<T> {
  private value: string;
  private patterns: Array<[string | RegExp, Handler<T>]>;
  private matched: boolean;
  private result: T | null;
  private otherwiseHandler: Handler<T> | null;

  constructor(value: string) {
    this.value = value;
    this.patterns = [];
    this.matched = false;
    this.result = null;
    this.otherwiseHandler = null;
  }

  public with(pattern: string | RegExp, handler: Handler<T>): Match<T> {
    if (this.matched) return this;
    const regexPattern = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
    if (regexPattern.test(this.value)) {
      this.matched = true;
      this.result = handler();
    }
    this.patterns.push([pattern, handler]);
    return this;
  }

  public otherwise(handler: Handler<T>): Match<T> {
    this.otherwiseHandler = handler;
    return this;
  }

  public execute(): T | null {
    if (this.matched) return this.result;
    if (this.otherwiseHandler) return this.otherwiseHandler();
    return null;
  }
}

export const matchFn = <T>(value: string): Match<T> => new Match<T>(value);

/**
 *
 * test
 *
 */
describe('matchFn', () => {
  it('"INT UNSIGNED" に対して "number" を返す', () => {
    // GIVEN: input("INT UNSIGNED")
    const type = 'INT UNSIGNED';

    // WHEN
    const result = matchFn(type)
      .with('INT', () => 'number')
      .with('DATE', () => 'Date')
      .with('CHAR', () => 'string')
      .execute();

    // THEN
    expect(result).toEqual('number');
  });

  it('"DATE" に対して "Date" を返す', () => {
    // GIVEN: input("DATE")
    const type = 'DATE';

    // WHEN
    const result = matchFn(type)
      .with('INT', () => 'number')
      .with('DATE', () => 'Date')
      .with('CHAR', () => 'string')
      .execute();

    // THEN
    expect(result).toEqual('Date');
  });

  it('未知の型に対しては null を返す', () => {
    // GIVEN: input("UNKNOWN")
    const type = 'UNKNOWN';

    // WHEN
    const result = matchFn(type)
      .with('INT', () => 'number')
      .with('DATE', () => 'Date')
      .with('CHAR', () => 'string')
      .execute();

    // THEN
    expect(result).toBeNull();
  });

  it('部分一致も許容する', () => {
    // GIVEN: input("INT UNSIGNED")
    const type = 'INT UNSIGNED';

    // WHEN
    const result = matchFn(type)
      .with(/INT/, () => 'number')
      .with(/DATE/, () => 'Date')
      .with(/CHAR/, () => 'string')
      .execute();

    // THEN
    expect(result).toEqual('number');
  });

  it('一致する値がない場合は`otherwise`に設定した値になる', () => {
    // GIVEN: input("STRING")
    const type = 'STRING';

    // WHEN
    const result = matchFn(type)
      .with('INT', () => 'number')
      .with('DATE', () => 'Date')
      .with('CHAR', () => 'string')
      .otherwise(() => 'string')
      .execute();

    // THEN
    expect(result).toEqual('string');
  });
});
