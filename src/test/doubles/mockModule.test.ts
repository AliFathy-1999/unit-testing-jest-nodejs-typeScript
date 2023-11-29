jest.mock('../../app/doubles/otherUtils', ()=>({
    //We want to keep the functionality of all the other functions in this module. to keep it, we use requireActual
    ...jest.requireActual('../../app/doubles/otherUtils'),
    calculateComplexity: () => 10,
}));

// Mock Built-in Module and random values
jest.mock('uuid',()=>({
    v4: ()=> '123'
}))
import * as otherUtils  from '../../app/doubles/otherUtils';

describe('Mock Module tests', () => {

    test("calculate complexity", () => {
        const result = otherUtils.calculateComplexity({} as any)
        expect(result).toBe(10);
    })

    test('keep other fynctions', ()=>{
        const result = otherUtils.toUpperCase('abc')
        expect(result).toBe('ABC');
    })

    test('string with id', ()=>{
        const result = otherUtils.toLowerCaseWithId('ABC')
        expect(result).toBe('abc123');
    })
})