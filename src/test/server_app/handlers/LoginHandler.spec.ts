import { Authorizer } from "../../../app/server_app/auth/Authorizer";
import { LoginHandler } from "../../../app/server_app/handlers/LoginHandler";
import { IncomingMessage, ServerResponse } from "http";
import { HTTP_CODES, HTTP_METHODS } from "../../../app/server_app/model/ServerModel";
import { Account } from "../../../app/server_app/model/AuthModel";

const getRequestBodyMock = jest.fn() as jest.Mock;

jest.mock("../../../app/server_app/utils/Utils", ()=>({
    getRequestBody: () => getRequestBodyMock()
}))


describe('RegisterHandler testing suites', ()=>{
    let sut: LoginHandler;

    const requestMock = {
        method: undefined
    }
    const responseMock = {
        statusCode: 0,
        writeHead: jest.fn(),
        write: jest.fn(),
    }
    const authorizerMock = {
        login: jest.fn()
    }
    const dummyAccount : Account = {
        id: '',
        userName: 'username',
        password: 'password',
    }
    const fakeToken = '1234';

    beforeEach(()=>{
        sut = new LoginHandler(
            requestMock as IncomingMessage,
            responseMock as any as ServerResponse,
            authorizerMock as any as Authorizer
        );
    })
    afterEach(()=>{
        sut = null;
        jest.clearAllMocks();
    })

    it('should return token for valid accounts in requests', async () => {
        requestMock.method = HTTP_METHODS.POST;
        getRequestBodyMock.mockResolvedValueOnce(dummyAccount);
        authorizerMock.login.mockResolvedValueOnce(fakeToken);
        await sut.handleRequest();

        expect(responseMock.statusCode).toBe(HTTP_CODES.CREATED)
        expect(responseMock.writeHead).toHaveBeenCalledWith(HTTP_CODES.CREATED, { 'Content-Type': 'application/json' });
        expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify({ token: fakeToken }))
    })

    it('Should return error for invalid credentials in requests', async () => {
            
        requestMock.method = HTTP_METHODS.POST;
        getRequestBodyMock.mockResolvedValueOnce(dummyAccount);
        authorizerMock.login.mockResolvedValueOnce(undefined);
        await sut.handleRequest();
        
        expect(responseMock.statusCode).toBe(HTTP_CODES.NOT_fOUND)
        expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify('wrong username or password'))

    })
    it('Should return bad request for invalid requests', async () => {
            
        requestMock.method = HTTP_METHODS.POST;
        getRequestBodyMock.mockResolvedValueOnce({});
        await sut.handleRequest();
 
        expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST)
        expect(responseMock.writeHead).toHaveBeenCalledWith(HTTP_CODES.BAD_REQUEST, { 'Content-Type': 'application/json' });
        expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify('userName and password required'))
        
    })
    it('Should do nothing for not supported http methods',async () => {

        requestMock.method = HTTP_METHODS.GET;
        await sut.handleRequest();

        expect(responseMock.writeHead).not.toHaveBeenCalled();
        expect(responseMock.write).not.toHaveBeenCalled();
        expect(getRequestBodyMock).not.toHaveBeenCalled();
    })
})