import { stringInfo } from "../../app/Utils";
import { calculateComplexity, toUpperCaseWithCb } from "../../app/doubles/otherUtils"

describe("Other Utils test suites", () => {
    //Fake Example 
    it('toUpperCase- calls callback for invalid argument  - fake', () => {
        const actual = toUpperCaseWithCb('', () => {})
        expect(actual).toBeUndefined();
    })

    it('toUpperCase- calls callback for valid argument  - fake', () => {
        const actual = toUpperCaseWithCb('abc', () => {})
        expect(actual).toBe('ABC')
    })

    //Stub Example
    it('calculates Complexity - stub', () => {
        const someInfo : Partial<stringInfo>= {
            length: 5,
            extraInfo: {
                field1: 'someInfo',
                field2: 'someOtherInfo',
            }
        }
        const actual = calculateComplexity(someInfo as stringInfo);
        expect(actual).toBe(10);
    })
})