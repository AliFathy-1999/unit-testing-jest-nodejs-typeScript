import { DataBase } from '../../../app/server_app/data/DataBase';

import * as IdGenerator from '../../../app/server_app/data/IdGenerator';
import { SessionToken, Account } from '../../../app/server_app/model/AuthModel';
import { SessionTokenDataAccess } from '../../../app/server_app/data/SessionTokenDataAccess';

const insertMock = jest.fn();
const getByMock = jest.fn();
const updateMock = jest.fn();

jest.mock('../../../app/server_app/data/DataBase',()=>{
    return {
        DataBase: jest.fn().mockImplementation(()=>{
            return {
                insert: insertMock,
                getBy: getByMock,
                update: updateMock,
            }
        })
    }
})


describe('Session Token DataAccess test suites', () => { 
    let sut: SessionTokenDataAccess;
    
    const fakeId = '12345';
    const dummyObject : Account = {
        id: '',
        userName: 'username',
        password: 'password',

    }

    beforeEach(()=>{
        sut = new SessionTokenDataAccess();
        expect(DataBase).toHaveBeenCalledTimes(1);
        //Override this metthod and generate instead of random id static id (fakeId)
        jest.spyOn(global.Date, 'now').mockReturnValue(0);
        jest.spyOn(IdGenerator, 'generateRandomId').mockReturnValueOnce(fakeId);
    })

    afterEach(()=>{
        sut = null;
        jest.clearAllMocks();
    })

    it('Should add reservation and return the id', async ()=>{
        insertMock.mockResolvedValueOnce(fakeId);
        const actualTokenId = await sut.generateToken(dummyObject);

        expect(actualTokenId).toBe(fakeId)
        expect(insertMock).toHaveBeenCalledWith({
            id: '',
            userName: dummyObject.userName,
            valid: true,
            expirationDate: new Date(1000 * 60 * 60 )
        });
    })

    it('Should invalidate token', async () => {
        await sut.invalidateToken(fakeId);
        expect(updateMock).toHaveBeenCalledWith(fakeId, 'valid', false);
    })

    it('Should Check valid token', async () => {
        getByMock.mockResolvedValueOnce({ valid : true });
        const actual = await sut.isValidToken({} as any);
        expect(actual).toBe(true);
    })

    it('Should Check Invalid token', async () => {
        getByMock.mockResolvedValueOnce({ valid : false });
        const actual = await sut.isValidToken({} as any);
        expect(actual).toBe(false);
    })
    it('Should Check inexistent token', async () => {
        getByMock.mockResolvedValueOnce(null);
        const actual = await sut.isValidToken({} as any);
        expect(actual).toBe(false);
    })
})