import { isArrayOfObjects } from '../../helpers/typeCheck';

describe('isArrayOfObjects', () => {
  it('オブジェクトの配列の場合はtrueを返す', () => {
    const data = [{ key: 'value' }, { anotherKey: 123 }];
    expect(isArrayOfObjects(data)).toEqual(true);
  });

  it('オブジェクトではない配列の場合はfalseを返す', () => {
    const data = [123, 'string'];
    expect(isArrayOfObjects(data)).toEqual(false);
  });

  it('配列ではない場合はfalseを返す', () => {
    const data = { key: 'value' };
    expect(isArrayOfObjects(data)).toEqual(false);
  });

  it('nullやundefinedの場合はfalseを返す', () => {
    expect(isArrayOfObjects(null)).toEqual(false);
    expect(isArrayOfObjects(undefined)).toEqual(false);
  });
});
