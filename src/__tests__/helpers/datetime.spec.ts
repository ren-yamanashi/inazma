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
    // GIVEN: output(YYYY-MM-DDThh:mm:ss)
    const nowDate = '2023-09-02T12:34:56';

    // WHEN
    const result = getNowDate();

    // THEN
    expect(result).toBe(nowDate);
  });
});
