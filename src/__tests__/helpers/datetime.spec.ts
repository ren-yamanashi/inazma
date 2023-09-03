import { getNowDate } from '../../helpers/datetime';

describe('getNowDate', () => {
  let spy: jest.SpyInstance;

  beforeAll(() => {
    const fixedDate = new Date('2023-09-02T12:34:56');
    spy = jest.spyOn(global, 'Date').mockImplementation(() => fixedDate);
  });

  afterAll(() => {
    spy.mockRestore();
  });

  it('`YYYY-MM-DDThh:mm:ss`の形式で日付が返される', () => {
    const result = getNowDate();
    expect(result).toBe('2023-09-02T12:34:56');
  });
});
