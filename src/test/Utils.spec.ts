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

    it('Should return info for valid string', ()=>{
        const sut= getStringInfo;
        const expectedUpperCase = 'MY-STRING';
        const expectedLowerCase = 'my-string';
        const expectedLength: number = 9;
        const expectedCharacters = ['M', 'y', '-', 'S', 't', 'r', 'i', 'n', 'g'];
        const expectedExtraInfo = {};
        const actual = sut('My-String');

        expect(actual.upperCase).toBe(expectedUpperCase);
        expect(actual.lowerCase).toBe(expectedLowerCase);

        expect(actual.length).toBe(expectedLength);
        expect(actual.characters).toHaveLength(expectedLength);
        expect(actual.characters).toEqual(expectedCharacters)
        expect(actual.extraInfo).toEqual(expectedExtraInfo)
    })
})