import { HTTP_CODES, HTTP_METHODS } from "../../app/server_app/model/ServerModel";
import { RequestTestWrapper } from "./test_utils/RequestTestWrapper"
import { ResponseTestWrapper } from "./test_utils/ResponseTestWrapper";

import { Server } from "../../app/server_app/server/Server";
import { DataBase } from "../../app/server_app/data/DataBase";
import { Account } from "../../app/server_app/model/AuthModel";
import  * as generateRandomId  from "../../app/server_app/data/IdGenerator";

jest.mock('../../app/server_app/data/DataBase');


const requestWrapper = new RequestTestWrapper();
const responseWrapper = new ResponseTestWrapper();

const fakeServer = {
    listen: ()=>{},
    close: ()=>{},
}

jest.mock('http', ()=>({
    createServer(cb: Function){
        cb(requestWrapper, responseWrapper);
        return fakeServer;
    }
}))

const dummyAccount: Account = {
    id: '',
    userName: 'username',
    password: 'password',
}

const fakeToken = '1234';

const jsonHeader = { 'Content-Type': 'application/json' }


describe('Login requests test suites', () => { 
    
    const insertSpy = jest.spyOn(DataBase.prototype, 'insert');
    const getBySpy = jest.spyOn(DataBase.prototype, 'getBy');


    beforeEach(()=>{
        requestWrapper.headers['user-agent'] = 'jest tests';
        requestWrapper.headers['content-type'] = 'application/json';
    })
    
    afterEach(()=>{
        requestWrapper.clearFields();
        responseWrapper.clearFields();
        jest.clearAllMocks();
    })

    it('Should login user with valid credentials', async () => {
        requestWrapper.method = HTTP_METHODS.POST;
        requestWrapper.body = {
            userName: dummyAccount.userName,
            password: dummyAccount.password
        }
        requestWrapper.url = 'localhost:8080/login';

        getBySpy.mockResolvedValueOnce(dummyAccount);
        insertSpy.mockResolvedValueOnce(fakeToken);

        await new Server().startServer();
        await new Promise(process.nextTick); //This solves timing issues

        expect(responseWrapper.statusCode).toBe(HTTP_CODES.CREATED);
        expect(responseWrapper.body).toEqual(expect.objectContaining({
            token: fakeToken
        }))
        expect(responseWrapper.headers).toContainEqual(jsonHeader);

    })

    it('Should login user with invalid credentials', async () => {
        requestWrapper.method = HTTP_METHODS.POST;
        requestWrapper.body = {
            userName: 'wrong username',
            password: dummyAccount.password
        }
        requestWrapper.url = 'localhost:8080/login';


        await new Server().startServer();
        await new Promise(process.nextTick); //This solves timing issues

        expect(responseWrapper.statusCode).toBe(HTTP_CODES.NOT_fOUND);
        expect(responseWrapper.body).toBe('wrong username or password')

    })

    it('should return bad request if no credentials in request', async () => {
        requestWrapper.method = HTTP_METHODS.POST;
        requestWrapper.body = {
            userName: 'wrong username',
        }
        requestWrapper.url = 'localhost:8080/login';


        await new Server().startServer();
        await new Promise(process.nextTick); //This solves timing issues

        expect(responseWrapper.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
        expect(responseWrapper.body).toBe('userName and password required')
    })

    it('should do nothing for not supported methods', async ()=>{
        requestWrapper.method = HTTP_METHODS.OPTIONS;
        requestWrapper.body = {};
        requestWrapper.url = 'localhost:8080/login';

        await new Server().startServer();
        await new Promise(process.nextTick); //This solves timing issues

        expect(responseWrapper.statusCode).toBeUndefined();
        expect(responseWrapper.body).toBeUndefined();
    })
})