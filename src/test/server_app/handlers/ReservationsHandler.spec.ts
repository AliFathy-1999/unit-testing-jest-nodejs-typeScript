import { Authorizer } from "../../../app/server_app/auth/Authorizer";
import { IncomingMessage, ServerResponse } from "http";
import { HTTP_CODES, HTTP_METHODS } from "../../../app/server_app/model/ServerModel";
import { Account } from "../../../app/server_app/model/AuthModel";
import { ReservationsDataAccess } from '../../../app/server_app/data/ReservationsDataAccess';
import { ReservationsHandler } from "../../../app/server_app/handlers/ReservationsHandler";
import { Reservation } from "../../../app/server_app/model/ReservationModel";
import { getRequestBody } from "../../../app/server_app/utils/Utils";

const getRequestBodyMock = jest.fn() as jest.Mock;

const createReservationMock = jest.fn();
const getAllReservationsMock = jest.fn();
const getReservationMock = jest.fn();
const deleteReservationMock = jest.fn();
const updateReservationMock = jest.fn();


jest.mock("../../../app/server_app/utils/Utils", ()=>({
    getRequestBody: () => getRequestBodyMock()
}))


const ReservationsDataAccessMock = {
    createReservation: createReservationMock,
    getAllReservations: getAllReservationsMock,
    getReservation: getReservationMock,
    deleteReservation: deleteReservationMock,
    updateReservation: updateReservationMock
}

describe('Reservation handler testing suites', ()=>{
    let sut: ReservationsHandler;

    const requestMock = {
        method: undefined,
        headers: {
            authorization: undefined
        },
        url : undefined,
    }
    const responseMock = {
        statusCode: 0,
        writeHead: jest.fn(),
        write: jest.fn(),
    }
    const authorizerMock = {
        registerUser: jest.fn(),
        validateToken: jest.fn()
    }
    const dummyAccount : Account = {
        id: '',
        userName: 'username',
        password: 'password',
    }
    const fakeReservationId = '1234';
    const fakeTokenId = 'abcd';
    const dummyReservation: Reservation = {
        id: undefined,
        endDate: new Date().toDateString(),
        startDate: new Date().toDateString(),
        room: 'room',
        user: 'user'
    }
    beforeEach(()=>{
        sut = new ReservationsHandler(
            requestMock as IncomingMessage,
            responseMock as any as ServerResponse,
            authorizerMock as any as Authorizer,
            ReservationsDataAccessMock as any as ReservationsDataAccess
        );


        requestMock.headers.authorization = 'abcd';
        authorizerMock.validateToken.mockResolvedValueOnce(true);
    })

    afterEach(()=>{
        sut = null;
        jest.clearAllMocks();
        requestMock.url = undefined;
        responseMock.statusCode = 0;
    })

    describe('POST Method Requests', ()=>{

        beforeEach(() => {
            requestMock.method = HTTP_METHODS.POST;
        })

        it('should create reservation from valid request', async () => {
            getRequestBodyMock.mockResolvedValueOnce(dummyReservation);
            ReservationsDataAccessMock.createReservation.mockResolvedValueOnce(fakeReservationId);
            await sut.handleRequest();
            expect(responseMock.statusCode).toBe(HTTP_CODES.CREATED);
            expect(responseMock.writeHead).toHaveBeenCalledWith(HTTP_CODES.CREATED, { 'Content-Type': 'application/json' });
            expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify({ reservationId: fakeReservationId }));
        })
        it('should not create reservation from invalid request', async () => {
            getRequestBodyMock.mockResolvedValueOnce({});
            await sut.handleRequest();

            expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
            expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify('Incomplete reservation!'));
        })
        it('should not create reservation from invalid fields in request', async () => {
            getRequestBodyMock.mockResolvedValueOnce({...dummyReservation, inValidField: 'invalid'});
            await sut.handleRequest();
            
            expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
            expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify('Incomplete reservation!'));
        })
    })
    describe('GET Method Requests', ()=>{

        beforeEach(() => {
            requestMock.method = HTTP_METHODS.GET;
        })

        it('should return all reservations for /all request', async () => {
            requestMock.url = '/reservations/all';
            ReservationsDataAccessMock.getAllReservations.mockResolvedValueOnce([dummyReservation]);

            await sut.handleRequest();
            expect(responseMock.writeHead).toHaveBeenCalledWith(HTTP_CODES.OK, { 'Content-Type': 'application/json' });
            expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify([ dummyReservation ]));
        })
        it('should return existing reservation for /id request', async () => {
            requestMock.url = `/reservations/${fakeReservationId}`;
            ReservationsDataAccessMock.getReservation.mockResolvedValueOnce(dummyReservation);
            await sut.handleRequest();
            expect(responseMock.writeHead).toHaveBeenCalledWith(HTTP_CODES.OK, { 'Content-Type': 'application/json' });
            expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify(dummyReservation));
        })
        it('should return not found for non existing id', async () => {
            requestMock.url = `/reservations/${fakeReservationId}`;
            ReservationsDataAccessMock.getReservation.mockResolvedValueOnce(undefined);

            await sut.handleRequest();

            expect(responseMock.statusCode).toBe(HTTP_CODES.NOT_fOUND)
            expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify(
                `Reservation with id ${fakeReservationId} not found`
            ));
        });
        it('should return bad request if no id provided', async () => {
            requestMock.url = `/reservations/`;
            await sut.handleRequest();
            expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST)
            expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify(
                'Please provide an ID!'
            ));
        })
    })
    describe('PUT Method Requests', ()=>{

        beforeEach(() => {
            requestMock.method = HTTP_METHODS.PUT;
        })

        it('should update reservation with all valid fields provided', async () => {
            requestMock.url = `/reservations/${fakeReservationId}`;
            ReservationsDataAccessMock.getReservation.mockResolvedValueOnce(dummyReservation);
            const dummyUpdateObj = {
                user: 'user5',
                startDate: 'someDate1',
            }
            //req.body
            getRequestBodyMock.mockResolvedValueOnce(dummyUpdateObj);
            await sut.handleRequest();
            // Called twice to update because there are 2 fields to update
            expect(ReservationsDataAccessMock.updateReservation).toHaveBeenCalledTimes(2);
            expect(ReservationsDataAccessMock.updateReservation).toHaveBeenCalledWith(fakeReservationId,'startDate',dummyUpdateObj.startDate);
            expect(ReservationsDataAccessMock.updateReservation).toHaveBeenCalledWith(fakeReservationId,'user',dummyUpdateObj.user);
            expect(responseMock.writeHead).toHaveBeenCalledWith(HTTP_CODES.OK, { 'Content-Type': 'application/json' });
            expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify(`Updated ${Object.keys(dummyUpdateObj)} of reservation ${fakeReservationId}`));
            
        });

        it('should return bad request if invalid fields are provided', async () => {
            requestMock.url = `/reservations/${fakeReservationId}`;
            ReservationsDataAccessMock.getReservation.mockResolvedValueOnce(deleteReservationMock);
            getRequestBodyMock.mockResolvedValueOnce({inValidField: 'invalid'});
            await sut.handleRequest();
            expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
            expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify('Please provide valid fields to update!'))

        });
        it('should return bad request if no fields are provided', async () => {
            requestMock.url = `/reservations/${fakeReservationId}`;
            ReservationsDataAccessMock.getReservation.mockResolvedValueOnce(dummyReservation);
            getRequestBodyMock.mockResolvedValueOnce({});
            await sut.handleRequest();
            expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST)
            expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify('Please provide valid fields to update!'));
        })
        it('should return not found for non existing id', async () => {
            requestMock.url = `/reservations/${fakeReservationId}`;
            ReservationsDataAccessMock.getReservation.mockResolvedValueOnce(undefined);

            await sut.handleRequest();

            expect(responseMock.statusCode).toBe(HTTP_CODES.NOT_fOUND)
            expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify(
                `Reservation with id ${fakeReservationId} not found`
            ));
        });
        it('should return bad request if no id provided', async () => {
            requestMock.url = `/reservations/`;
            await sut.handleRequest();
            expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST)
            expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify(
                'Please provide an ID!'
            ));
        })
    })
    describe('DELETE Method Requests', ()=>{

        beforeEach(() => {
            requestMock.method = HTTP_METHODS.DELETE;
        }) 

        it('should delete reservation for /id request', async () => {
            requestMock.url = `/reservations/${fakeReservationId}`;
            await sut.handleRequest();
            expect(ReservationsDataAccessMock.deleteReservation).toHaveBeenCalledWith(fakeReservationId)
            expect(responseMock.statusCode).toBe(HTTP_CODES.OK);
            expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify(`Deleted reservation with id ${fakeReservationId}`));
        })

        it('should return not found for non existing id', async () => {
            requestMock.url = `/reservations/`;
            ReservationsDataAccessMock.getReservation.mockResolvedValueOnce(undefined);
            await sut.handleRequest();
            expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
            expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify(
                'Please provide an ID!'
            ))
        })
    })

    it('should return nothing for not authorized requests', async ()=>{
        requestMock.headers.authorization = fakeTokenId;
        //replaces the mock implementation with an empty function, returning undefined.
        authorizerMock.validateToken.mockReset();
        authorizerMock.validateToken.mockResolvedValueOnce(false);

        await sut.handleRequest();
        
        expect(responseMock.statusCode).toBe(HTTP_CODES.UNAUTHORIZED)
        expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify(
            'Unauthorized operation!'
        ));
    })

    it('should return nothing if no authorization header is present', async () => {
        requestMock.headers.authorization = undefined;
        
        await sut.handleRequest();

        expect(responseMock.statusCode).toBe(HTTP_CODES.UNAUTHORIZED)
        expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify(
            'Unauthorized operation!'
        ));
    });
    it('should do nothing for not supported http methods', async () => {
        requestMock.method = 'SOME-METHOD'
        
        await sut.handleRequest();

        expect(responseMock.write).not.toHaveBeenCalled();
        expect(responseMock.writeHead).not.toHaveBeenCalled();
    });
})