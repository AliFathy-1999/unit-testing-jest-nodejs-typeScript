import { stringInfo } from "../../app/Utils";
import { OtherStringUtils, calculateComplexity, toUpperCaseWithCb } from "../../app/doubles/otherUtils"

describe("Other Utils test suites", () => {


    //Spies Example
    describe.only('Other String Utils tests with spies', () => { 
        let sut: OtherStringUtils;

        beforeEach(()=>{
            sut = new OtherStringUtils();
        })
        test('Use a spy to track calls', () => {
            const toUpperCaseSpy = jest.spyOn(sut,'toUpperCase');            
            sut.toUpperCase('abc');
            expect(toUpperCaseSpy).toHaveBeenCalledWith('abc');
        });
        test('Use a spy to replace the implementation of a method', () => {
            jest.spyOn(sut as any, 'callExternalService').mockImplementation(() => {
                console.log('call external service implementation') 
            });
            (sut as any).callExternalService();
        });

    })

    //Track callbacks with Mock
    describe('Tracking callback with Jest Mocks', () => {

        const callBackMock = jest.fn();
        
        // We need to clear the mock calls before each test (Because of mocks tracking)
        afterEach(()=>{
            callBackMock.mockClear();
        })
        it('calls callback for invalid argument  - Mock - track calls', () => {
            const actual = toUpperCaseWithCb('', callBackMock)
            expect(actual).toBeUndefined();
            expect(callBackMock).toHaveBeenCalledWith('Invalid arg');
            expect(callBackMock).toHaveBeenCalledTimes(1);
        })    
        
        it('calls callback for valid argument  - Mock - track calls', () => {
            const actual = toUpperCaseWithCb('abc', callBackMock)
            expect(actual).toBe('ABC');
            expect(callBackMock).toHaveBeenCalledWith(`called function with abc`);
            expect(callBackMock).toHaveBeenCalledTimes(1);
        })   
     })
    //Track callbacks without Mock
    describe('Tracking callback', () => {
        let cbArgs = [];
        let timeCalled = 0;

        function callBackMock(arg:string){
            cbArgs.push(arg);
            timeCalled++;
        }

        afterEach(()=>{
            // Clearing tracking fields
            cbArgs = [];
            timeCalled = 0;
        })
        it('calls callback for invalid argument  - Manual Mock - track calls', () => {
            const actual = toUpperCaseWithCb('', callBackMock)
            expect(actual).toBeUndefined();
            expect(cbArgs).toContain('Invalid arg');
            expect(timeCalled).toBe(1);
        })    
        
        it('calls callback for valid argument  - Manual Mock - track calls', () => {
            const actual = toUpperCaseWithCb('abc', callBackMock)
            expect(actual).toBe('ABC');
            expect(cbArgs).toContain(`called function with abc`);
            expect(timeCalled).toBe(1);
        })    
    })
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