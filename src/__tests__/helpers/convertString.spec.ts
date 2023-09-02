import { toUpperCamelCase } from "../../helpers/convertString";

describe('toUpperCamelCase', () => {
    it("正常に変換される(LowerCase)", () => {
        // GIVEN: input(LowerCase)
        const arg = "sample"
        
        // GIVEN: output(UpperCamelCase)
        const expectedValue = "Sample"

        // WHEN
        const result = toUpperCamelCase(arg)

        // THEN
        expect(result).toEqual(expectedValue)
    })

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