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
