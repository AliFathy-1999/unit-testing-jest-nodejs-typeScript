import { calculateComplexity } from "../../app/doubles/otherUtils"

describe("Other Utils test suites", () => {

    it('calculates Complexity', () => {
        const someInfo = {
            length: 5,
            extraInfo: {
                field1: 'someInfo',
                field2: 'someOtherInfo',
            }
        }
        const actual = calculateComplexity(someInfo as any)
        expect(actual).toBe(10);
    })
})