import { HTTP_CODES, HTTP_METHODS } from "../../app/server_app/model/ServerModel";
import { RequestTestWrapper } from "./test_utils/RequestTestWrapper"
import { ResponseTestWrapper } from "./test_utils/ResponseTestWrapper";

import { Server } from "../../app/server_app/server/Server";
import { DataBase } from "../../app/server_app/data/DataBase";
import { Account } from "../../app/server_app/model/AuthModel";
import  * as generateRandomId  from "../../app/server_app/data/IdGenerator";
import { Reservation } from "../../app/server_app/model/ReservationModel";

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

const dummyReservation: Reservation = {
    id: '',
    endDate: 'dummyEndDate',
    startDate: 'dummyStartDate',
    room: 'dummyRoom',
    user: 'dummyUser'
}

const fakeId = '1234';

const jsonHeader = { 'Content-Type': 'application/json' }


describe('Reservation requests test suites', () => { 
    
    const insertSpy = jest.spyOn(DataBase.prototype, 'insert');
    const getBySpy = jest.spyOn(DataBase.prototype, 'getBy');
    const getAllSpy = jest.spyOn(DataBase.prototype, 'getAllElements');
    const deleteSpy = jest.spyOn(DataBase.prototype, 'delete');
    const updateSpy = jest.spyOn(DataBase.prototype, 'update');


    beforeEach(()=>{
        requestWrapper.headers['user-agent'] = 'jest tests';
        requestWrapper.headers['authorization'] = fakeId;
        //authenticate calls
        getBySpy.mockResolvedValueOnce({
            valid : true
        });
    })
    
    afterEach(()=>{
        requestWrapper.clearFields();
        responseWrapper.clearFields();
        jest.clearAllMocks();
    })

    describe('POST requests', () => {
        it('should create reservation from valid request', async () => {
            requestWrapper.method = HTTP_METHODS.POST;
            requestWrapper.body = dummyReservation;
            requestWrapper.url = 'localhost:8080/reservation';
            insertSpy.mockResolvedValueOnce(fakeId);
    
            await new Server().startServer();
    
            await new Promise(process.nextTick); // this solves timing issues, 
    
            expect(responseWrapper.statusCode).toBe(HTTP_CODES.CREATED);
            expect(responseWrapper.body).toEqual({
                reservationId: fakeId
            })
            expect(responseWrapper.headers).toContainEqual(jsonHeader);
        });

        it('should not create reservation from invalid request', async () => {
            requestWrapper.method = HTTP_METHODS.POST;
            requestWrapper.body = {};
            requestWrapper.url = 'localhost:8080/reservation';

            await new Server().startServer();
            await new Promise(process.nextTick); // this solves timing issues,

            expect(responseWrapper.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
            expect(responseWrapper.body).toBe('Incomplete reservation!');
        });
    })

    describe('GET requests', () => {
        it('should return all reservations', async () => {
            requestWrapper.method = HTTP_METHODS.GET;
            requestWrapper.url = 'localhost:8080/reservation/all';
            getAllSpy.mockResolvedValueOnce([dummyReservation, dummyReservation]);
    
            await new Server().startServer();
    
            await new Promise(process.nextTick); // this solves timing issues, 
    
            expect(responseWrapper.statusCode).toBe(HTTP_CODES.OK);
            expect(responseWrapper.body).toEqual([dummyReservation, dummyReservation])
            expect(responseWrapper.headers).toContainEqual(jsonHeader);
        });

        it('should return specific reservations', async () => {
            requestWrapper.method = HTTP_METHODS.GET;
            requestWrapper.url = `localhost:8080/reservation/${fakeId}`;
            getBySpy.mockResolvedValueOnce(dummyReservation);
    
            await new Server().startServer();
    
            await new Promise(process.nextTick); // this solves timing issues, 
    
            expect(responseWrapper.statusCode).toBe(HTTP_CODES.OK);
            expect(responseWrapper.body).toEqual(dummyReservation)
            expect(responseWrapper.headers).toContainEqual(jsonHeader);
        });

        it('should return not found if reservation is not found', async () => {
            requestWrapper.method = HTTP_METHODS.GET;
            requestWrapper.url = `localhost:8080/reservation/${fakeId}`;
            getBySpy.mockResolvedValueOnce(undefined);
    
            await new Server().startServer();
    
            await new Promise(process.nextTick); // this solves timing issues, 
    
            expect(responseWrapper.statusCode).toBe(HTTP_CODES.NOT_fOUND);
            expect(responseWrapper.body).toEqual(`Reservation with id ${fakeId} not found`)
        });

        it('should return bad request if reservation is not provided', async () => {
            requestWrapper.method = HTTP_METHODS.GET;
            requestWrapper.url = `localhost:8080/reservation`;
    
            await new Server().startServer();
    
            await new Promise(process.nextTick); // this solves timing issues, 
    
            expect(responseWrapper.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
            expect(responseWrapper.body).toEqual('Please provide an ID!')
        });
    })
    describe('PUT requests', () => {
        it('should update reservation if found and valid request', async () => {
            requestWrapper.method = HTTP_METHODS.PUT;
            requestWrapper.url = `localhost:8080/reservation/${fakeId}`;
            getBySpy.mockResolvedValueOnce(dummyReservation);
            updateSpy.mockResolvedValue(undefined);
            requestWrapper.body = {
                user: 'someOtherUser',
                startDate: 'someOtherStartDate'
            }
    
            await new Server().startServer();
    
            await new Promise(process.nextTick); // this solves timing issues, 
    
            expect(responseWrapper.statusCode).toBe(HTTP_CODES.OK);
            expect(responseWrapper.body).toEqual(
                `Updated user,startDate of reservation ${fakeId}`
            )
            expect(responseWrapper.headers).toContainEqual(jsonHeader);
        });

        it('should not update reservation if invalid fields are provided', async () => {
            requestWrapper.method = HTTP_METHODS.PUT;
            requestWrapper.url = `localhost:8080/reservation/${fakeId}`;
            getBySpy.mockResolvedValueOnce(dummyReservation);
            updateSpy.mockResolvedValue(undefined);
            requestWrapper.body = {
                user: 'someOtherUser',
                startDate: 'someOtherStartDate',
                someOtherField: 'someOtherField'
            }
    
            await new Server().startServer();
    
            await new Promise(process.nextTick); // this solves timing issues, 
    
            expect(responseWrapper.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
            expect(responseWrapper.body).toEqual('Please provide valid fields to update!')
        });

        it('should not update reservation if it is not found', async () => {
            requestWrapper.method = HTTP_METHODS.PUT;
            requestWrapper.url = `localhost:8080/reservation/${fakeId}`;
            getBySpy.mockResolvedValueOnce(undefined);
    
            await new Server().startServer();
    
            await new Promise(process.nextTick); // this solves timing issues, 
    
            expect(responseWrapper.statusCode).toBe(HTTP_CODES.NOT_fOUND);
            expect(responseWrapper.body).toEqual(`Reservation with id ${fakeId} not found`)
        });

        it('should return bad request if no reservation id is provided', async () => {
            requestWrapper.method = HTTP_METHODS.PUT;
            requestWrapper.url = `localhost:8080/reservation`;
    
            await new Server().startServer();
    
            await new Promise(process.nextTick); // this solves timing issues, 
    
            expect(responseWrapper.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
            expect(responseWrapper.body).toEqual('Please provide an ID!')
        });

    });
    describe('DELETE requests', () => {
        it('should delete specific reservations', async () => {
            requestWrapper.method = HTTP_METHODS.DELETE;
            requestWrapper.url = `localhost:8080/reservation/${fakeId}`;
            deleteSpy.mockResolvedValueOnce(undefined);
    
            await new Server().startServer();
    
            await new Promise(process.nextTick); // this solves timing issues, 
    
            expect(responseWrapper.statusCode).toBe(HTTP_CODES.OK);
            expect(responseWrapper.body).toEqual(`Deleted reservation with id ${fakeId}`)
        });

        it('should return bad request if no reservation id is provided', async () => {
            requestWrapper.method = HTTP_METHODS.DELETE;
            requestWrapper.url = `localhost:8080/reservation`;
    
            await new Server().startServer();
    
            await new Promise(process.nextTick); // this solves timing issues, 
    
            expect(responseWrapper.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
            expect(responseWrapper.body).toEqual('Please provide an ID!')
        });
    })

    it('should do nothing for not supported methods', async () => {
        requestWrapper.method = HTTP_METHODS.OPTIONS;
        requestWrapper.body = {};
        requestWrapper.url = 'localhost:8080/reservation';

        await new Server().startServer();

        await new Promise(process.nextTick); // this solves timing issues, 

        expect(responseWrapper.statusCode).toBeUndefined();
        expect(responseWrapper.headers).toHaveLength(0);
        expect(responseWrapper.body).toBeUndefined();
    });

    it('should return not authorized if request is not authorized', async () => {
        requestWrapper.method = HTTP_METHODS.POST;
        requestWrapper.body = {};
        requestWrapper.url = 'localhost:8080/reservation';
        getBySpy.mockReset();
        getBySpy.mockResolvedValueOnce(undefined);

        await new Server().startServer();

        await new Promise(process.nextTick); // this solves timing issues, 

        expect(responseWrapper.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
        expect(responseWrapper.body).toEqual('Unauthorized operation!');
    });
})