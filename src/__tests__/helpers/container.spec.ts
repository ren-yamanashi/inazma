import { describe, expect, it } from 'vitest';
import { Container, InjectionKey } from '../../helpers/container';

describe('Container', () => {
  const container = new Container();

  class SampleClass {
    sayHello() {
      return 'Hello';
    }
  }

  it('正常に登録される', () => {
    // GIVEN: input
    const key: InjectionKey<SampleClass> | string = 'SampleClass';

    // GIVEN: output(SampleClass)
    const service = new SampleClass();

    // WHEN
    container.register(key, service);
    const result = container.resolve<SampleClass>(key);

    // THEN
    expect(result).toEqual(service);
  });

  it('キーに一致するクラスが見つからない場合は、エラー', () => {
    // GIVEN: input()
    const key: InjectionKey<unknown> | string = 'NonExistentClass';

    // WHEN
    // THEN
    expect(() => container.resolve(key)).toThrow(`Service "${key}" not found`);
  });
});
