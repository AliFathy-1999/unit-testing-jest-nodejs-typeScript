import { toUpperCase,getStringInfo, stringUtils } from "../app/Utils";

describe('Utils test suite', () => {
    
    describe('String utils tests', () => {
        
        let sut: stringUtils;
        // Before each test make instance of object stringUtils
        beforeEach(() => {
            sut = new stringUtils(); // Independent objects
            console.log("Setup");
        })

        afterEach(() => {
            sut = null
            console.log("Teardown");
        })

        test.todo('long string length');

        it('Should Return Uppercase string', () => {
            // Arrange
            // const sut = new stringUtils(); // Replace it with jest hooks
            const actual = sut.toUpperCase('abc');
            expect(actual).toBe('ABC');
            console.log("Actual test");
            
        })
    })


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
        it('Should Return Uppercase string', ()=>{
            const actual = getStringInfo('My-String');
            expect(actual.upperCase).toBe('MY-STRING');
        })
        it('Should Return Lowercase string', ()=>{
            const actual = getStringInfo('My-String');
            expect(actual.lowerCase).toBe('my-string');
        })
        it('Should Return length 9', ()=>{
            const actual = getStringInfo('My-String');
            expect(actual.length).toBe(9);
        })
        it('Should Return an array of length 9', ()=>{
            const actual = getStringInfo('My-String');
            expect(actual.characters).toHaveLength(9);
        })
        it('Should Return an array of not same order characters but in array', ()=>{
            const actual = getStringInfo('My-String');
            expect(actual.characters).toEqual(
                expect.arrayContaining([ 'S', 't', 'r', 'i', 'n', 'g', 'M', 'y', '-'])
            )
        })
        it('Should Return an array of same order characters in array', ()=>{
            const actual = getStringInfo('My-String');
            expect(actual.characters).toEqual(['M', 'y', '-', 'S', 't', 'r', 'i', 'n', 'g'])
        })
        it('Should Return an object with extra info', ()=>{
            const actual = getStringInfo('My-String');
            expect(actual.extraInfo).not.toBeUndefined()
            expect(actual.extraInfo).not.toBeUndefined()
            expect(actual.extraInfo).toBeDefined()
            expect(actual.extraInfo).toBeTruthy()
            expect(actual.extraInfo).toEqual({})
        })
        it('Should Return conntain character in array ', ()=>{
            const actual = getStringInfo('My-String');
            expect(actual.characters).toContain<string>('g')
        })
    })

    describe("ToUpperCase test cases", ()=>{
        it.each([
            { input : 'abc', expected : 'ABC'},
            { input : 'My-String', expected : 'MY-STRING'},
            { input : 'def', expected : 'DEF'}
        ])("$input toUpperCase should return $expected", ({ input, expected })=>{
            const actual = toUpperCase(input);
            expect(actual).toBe(expected);
        })
    })
})