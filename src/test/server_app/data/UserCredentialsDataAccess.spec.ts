import { DataBase } from "../../../app/server_app/data/DataBase";
import { UserCredentialsDataAccess } from "../../../app/server_app/data/UserCredentialsDataAccess";
import { Account } from "../../../app/server_app/model/AuthModel";

const insertMock = jest.fn();
const getByMock = jest.fn();


// Mocking the 'DataBase' module using Jest's mocking functionality
jest.mock("../../../app/server_app/data/DataBase", () => {
    // Mocking the 'DataBase' module using Jest's mocking functionality
    return {
        // Returning a mocked version of the 'DataBase' module
        // Create Database instance only once for all tests
        //It (DataBase:{insert:insertMock}) will make error due to in scope, to be fixed use 
        DataBase : jest.fn().mockImplementation(() => {
            return {
                insert: insertMock,
                getBy: getByMock,
            }
        })
    }
});

describe('UserCredentialsDataAccess testing suites', ()=>{
    let sut: UserCredentialsDataAccess;

    const dummyAccount : Account = {
        id: '',
        userName: 'username',
        password: 'password',
    }
    const fakeId = '1234';

    beforeEach(()=>{
        sut = new UserCredentialsDataAccess();
        expect(DataBase).toHaveBeenCalledTimes(1);
    })
    afterEach(()=>{
        sut = null;
        jest.clearAllMocks();
    })
    it('Should add user and return the id', async ()=>{
        // We work with async code we need to use mockResolvedValueOnce
        insertMock.mockResolvedValueOnce(fakeId);
        const actualId = await sut.addUser(dummyAccount);        
        expect(actualId).toBe(fakeId);
        //Ensure that function insertMock is called with argument dummyAccount
        expect(insertMock).toHaveBeenCalledWith(dummyAccount);
    })

    it('Should get user By id and return the user', async ()=>{
        // We work with async code we need to use mockResolvedValueOnce
        getByMock.mockResolvedValueOnce(dummyAccount);
        const actual = await sut.getUserById(fakeId);        
        expect(actual).toEqual(dummyAccount);
        //Ensure that function getByMock is called with argument id and 1234
        expect(getByMock).toHaveBeenCalledWith('id', fakeId);
    })

    it('Should get user By name and return the user', async ()=>{
        // We work with async code we need to use mockResolvedValueOnce
        getByMock.mockResolvedValueOnce(dummyAccount);
        const actual = await sut.getUserByUserName(dummyAccount.userName);        
        expect(actual).toEqual(dummyAccount);
        //Ensure that function getByMock is called with argument id and 1234
        expect(getByMock).toHaveBeenCalledWith('userName', dummyAccount.userName);
    })
})