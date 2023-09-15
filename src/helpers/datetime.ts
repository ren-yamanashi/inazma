import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

export const getNowDate = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

/**
 *
 * test
 *
 */
describe('getNowDate', () => {
  beforeEach(() => {
    // tell vitest we use mocked time
    vi.useFakeTimers();
  });

  afterEach(() => {
    // restoring date after each test run
    vi.useRealTimers();
  });

  it('`YYYY-MM-DDThh:mm:ss`の形式で日付が返される', () => {
    // GIVEN: output(YYYY-MM-DDThh:mm:ss)
    const nowDate = '2023-09-02T12:34:56';

    vi.setSystemTime(nowDate);

    // WHEN
    const result = getNowDate();

    // THEN
    expect(result).toBe(nowDate);
  });
});
