import { Authorizer } from "../../../app/server_app/auth/Authorizer";
import { RegisterHandler } from "../../../app/server_app/handlers/RegisterHandler";
import { IncomingMessage, ServerResponse } from "http";
import { getRequestBody } from "../../../app/server_app/utils/Utils";
import { HTTP_CODES, HTTP_METHODS } from "../../../app/server_app/model/ServerModel";
import { Account } from "../../../app/server_app/model/AuthModel";

const getRequestBodyMock = jest.fn() as jest.Mock;

jest.mock("../../../app/server_app/utils/Utils", ()=>({
    getRequestBody: () => getRequestBodyMock()
}))


describe('RegisterHandler testing suites', ()=>{
    let sut: RegisterHandler;
    // private authorizer: Authorizer;
    // private request: IncomingMessage
    // private response: ServerResponse;
    const requestMock = {
        method: undefined
    }
    const responseMock = {
        statusCode: 0,
        writeHead: jest.fn(),
        write: jest.fn(),
    }
    const authorizerMock = {
        registerUser: jest.fn()
    }
    const dummyAccount : Account = {
        id: '',
        userName: 'username',
        password: 'password',
    }
    const fakeId = '1234';

    beforeEach(()=>{
        sut = new RegisterHandler(
            requestMock as IncomingMessage,
            responseMock as any as ServerResponse,
            authorizerMock as any as Authorizer
        );
    })
    afterEach(()=>{
        sut = null;
        jest.clearAllMocks();
    })

    it('Should register valid accounts in request', async () => {
        requestMock.method = HTTP_METHODS.POST;
        getRequestBodyMock.mockResolvedValueOnce(dummyAccount);
        authorizerMock.registerUser.mockResolvedValueOnce(fakeId);
        await sut.handleRequest();
        expect(responseMock.statusCode).toBe(HTTP_CODES.CREATED)
        expect(responseMock.writeHead).toHaveBeenCalledWith(HTTP_CODES.CREATED, { 'Content-Type': 'application/json' });
        expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify({ userId: fakeId }));})
})