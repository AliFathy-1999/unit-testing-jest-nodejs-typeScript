import { ReservationsDataAccess } from '../../../app/server_app/data/ReservationsDataAccess';
import { DataBase } from '../../../app/server_app/data/DataBase';

import * as IdGenerator from '../../../app/server_app/data/IdGenerator';
import { Reservation } from '../../../app/server_app/model/ReservationModel';

const insertMock = jest.fn();
const getByMock = jest.fn();
const updateMock = jest.fn();
const deleteMock = jest.fn();
const getAllElementsMock = jest.fn();

jest.mock('../../../app/server_app/data/DataBase',()=>{
    return {
        DataBase: jest.fn().mockImplementation(()=>{
            return {
                insert: insertMock,
                getBy: getByMock,
                update: updateMock,
                delete: deleteMock,
                getAllElements: getAllElementsMock
            }
        })
    }
})


describe('Reservations DataAccess test suites', () => { 
    let sut: ReservationsDataAccess;
    
    const fakeId = '12345';
    const dummyObject : Reservation = {
        endDate: 'someEndDate',
        startDate: 'someStartDate',
        id: '',
        room: 'someRoom',
        user: 'someUser'
    }
    const dummyObject2 : Reservation = {
        endDate: 'someEndDate2',
        startDate: 'someStartDate2',
        id: '',
        room: 'someRoom2',
        user: 'someUser2'
    }
    beforeEach(()=>{
        sut = new ReservationsDataAccess();
        expect(DataBase).toHaveBeenCalledTimes(1);
        //Override this metthod and generate instead of random id static id (fakeId)
        jest.spyOn(IdGenerator, 'generateRandomId').mockReturnValueOnce(fakeId);
    })

    afterEach(()=>{
        sut = null;
        jest.clearAllMocks();
        dummyObject.id = '';

    })

    it('Should add reservation and return the id', async ()=>{
        insertMock.mockResolvedValueOnce(fakeId);
        const actual = await sut.createReservation(dummyObject);

        expect(actual).toBe(fakeId)
        expect(insertMock).toHaveBeenCalledWith(dummyObject);
    })
    it('Should get reservation By id and return the reservation', async ()=>{

        getByMock.mockResolvedValueOnce(dummyObject);
        const actual = await sut.getReservation(fakeId);

        expect(actual).toEqual(dummyObject)
        expect(getByMock).toHaveBeenCalledWith('id', fakeId);
    })

    it('should make the update reservation call', async () => {
        await sut.updateReservation(fakeId, 'user', 'ali');
        expect(updateMock).toHaveBeenCalledWith(fakeId, 'user', 'ali');
    });

    it('should make the delete reservation call', async () => {
        await sut.deleteReservation(fakeId);
        expect(deleteMock).toHaveBeenCalledWith(fakeId);
    })
    it('should get all reservations', async () => {
        getAllElementsMock.mockResolvedValueOnce([dummyObject,dummyObject2])
        const actual = await sut.getAllReservations();

        expect(actual).toEqual([dummyObject,dummyObject2])
        expect(getAllElementsMock).toHaveBeenCalled();
    })
 })