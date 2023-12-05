import { getRequestBody } from "../../../app/server_app/utils/Utils";
import { IncomingMessage } from 'http';

const requestMock = {
    on : jest.fn(),
}

const dummyObject = {
    name: 'Ali',
    age: 24,
    city: 'Cairo',
}

const dummyObjectToString = JSON.stringify(dummyObject);


describe('getRequestBody test suites', () => { 

    it('Should return object for valid JSON', async () => {
        requestMock.on.mockImplementation((event, cb)=>{
            if(event === 'data')
                cb(dummyObjectToString)
            else
                cb()
        })
        const actual = await getRequestBody(requestMock as any as IncomingMessage);
        expect(actual).toEqual(dummyObject)
    })

    it('Should throw error for invalid JSON', async () => {
        requestMock.on.mockImplementation((event, cb)=>{
            if(event === 'data')
                cb('s' + dummyObjectToString)
            else
                cb()
        })
        
        await expect( getRequestBody(requestMock as any ) ).rejects.toThrow('Unexpected token s in JSON at position 0');
    })

    it('Should throw error for unexpected error', async () => {
        const dummyError = new Error('Someting went wrong!')
        requestMock.on.mockImplementation((event, cb)=>{
            if(event === 'error')
                cb(dummyError)
        })

        await expect( getRequestBody(requestMock as any ) ).rejects.toThrow(dummyError.message);
    })

})