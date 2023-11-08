import { toUpperCase,getStringInfo } from "../app/Utils";

describe('Utils test suite', () => {
    
    it('Test upper case function', () => {
        // Arrange
        const sut = toUpperCase;
        const expected = 'TEST';

        // Act
        const actual = sut('test');

        // Assert
        expect(actual).toBe(expected);
    })
    describe('Get string info for arg My-String should', ()=>{
        test('Should Return Uppercase string', ()=>{
            const actual = getStringInfo('My-String');
            expect(actual.upperCase).toBe('MY-STRING');
        })
        test('Should Return Lowercase string', ()=>{
            const actual = getStringInfo('My-String');
            expect(actual.lowerCase).toBe('my-string');
        })
        test('Should Return length 9', ()=>{
            const actual = getStringInfo('My-String');
            expect(actual.length).toBe(9);
        })
        test('Should Return an array of length 9', ()=>{
            const actual = getStringInfo('My-String');
            expect(actual.characters).toHaveLength(9);
        })
        test('Should Return an array of not same order characters but in array', ()=>{
            const actual = getStringInfo('My-String');
            expect(actual.characters).toEqual(
                expect.arrayContaining([ 'S', 't', 'r', 'i', 'n', 'g', 'M', 'y', '-'])
            )
        })
        test('Should Return an array of same order characters in array', ()=>{
            const actual = getStringInfo('My-String');
            expect(actual.characters).toEqual(['M', 'y', '-', 'S', 't', 'r', 'i', 'n', 'g'])
        })
        test('Should Return an object with extra info', ()=>{
            const actual = getStringInfo('My-String');
            expect(actual.extraInfo).not.toBeUndefined()
            expect(actual.extraInfo).not.toBeUndefined()
            expect(actual.extraInfo).toBeDefined()
            expect(actual.extraInfo).toBeTruthy()
            expect(actual.extraInfo).toEqual({})
        })
        test('Should Return conntain character in array ', ()=>{
            const actual = getStringInfo('My-String');
            expect(actual.characters).toContain<string>('g')
        })
    })

})