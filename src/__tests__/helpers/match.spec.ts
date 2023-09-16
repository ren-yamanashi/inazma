import { describe, expect, it } from 'vitest';
import { matchFn } from '../../helpers/match';

describe('match関数', () => {
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
