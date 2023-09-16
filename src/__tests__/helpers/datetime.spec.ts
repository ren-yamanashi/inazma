import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getNowDate } from '../../helpers/datetime';

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
