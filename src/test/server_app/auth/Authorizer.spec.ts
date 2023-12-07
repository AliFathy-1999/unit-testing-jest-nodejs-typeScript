import { SessionTokenDataAccess } from '../../../app/server_app/data/SessionTokenDataAccess';
import { Authorizer } from '../../../app/server_app/auth/Authorizer';
import { UserCredentialsDataAccess } from '../../../app/server_app/data/UserCredentialsDataAccess';

//SessionTokenDataAccess Mocks
const isValidTokenMock = jest.fn()
const generateTokenMock = jest.fn()
const invalidateTokenMock = jest.fn()

jest.mock('../../../app/server_app/data/SessionTokenDataAccess.ts', () => {
    return {
        SessionTokenDataAccess: jest.fn().mockImplementation(() => {
            return {
                isValidToken: isValidTokenMock,
                generateToken: generateTokenMock,
                invalidateToken: invalidateTokenMock
            }
        })
    }
})

//UserCredentialsDataAccess Mocks
const addUserMock = jest.fn()
const getUserByUserNameMock = jest.fn()

jest.mock('../../../app/server_app/data/UserCredentialsDataAccess.ts', () => {
    return {
        UserCredentialsDataAccess: jest.fn().mockImplementation(() => {
            return {
                addUser: addUserMock,
                getUserByUserName: getUserByUserNameMock,
            }
        })
    }
})

describe('Authorizer test suite', () => { 
    let sut: Authorizer;
    const fakeId = '123';
    const dummyObject = {
        id: '',
        password: 'username',
        userName: 'password'
    }

    beforeEach(() => {
        sut = new Authorizer();
        expect(SessionTokenDataAccess).toHaveBeenCalledTimes(1);
        expect(UserCredentialsDataAccess).toHaveBeenCalledTimes(1);
    })

    afterEach(() => {
        sut = null;
        jest.clearAllMocks();
    })

    it('Should validate token',async ()=>{
        //Return false due to there is no user registered
        isValidTokenMock.mockResolvedValueOnce(false);
        const actual = await sut.validateToken(fakeId)
        expect(actual).toBe(false)
    })

    it('should return id for new registered user', async () => {
        addUserMock.mockResolvedValueOnce(fakeId);
        const actual = await sut.registerUser(dummyObject.userName, dummyObject.password);

        expect(actual).toBe(fakeId);
        expect(addUserMock).toHaveBeenCalledWith(dummyObject)
    });

    it('should return tokenId for valid credentials', async () => {
        // Mock the return value of getUserByUserName
        getUserByUserNameMock.mockResolvedValueOnce({
            userName: dummyObject.userName,
            password: dummyObject.password
        })
        // Mock the return value of generateToken
        generateTokenMock.mockResolvedValueOnce(fakeId);
        // Call the login method
        const actual = await sut.login(dummyObject.userName, dummyObject.password);
        // Verify that generateToken was called with the correct arguments
        expect(actual).toBe(fakeId);
    });

    it('should return undefined for invalid credentials', async () => {
        getUserByUserNameMock.mockResolvedValueOnce({
            userName: dummyObject.userName,
            password: dummyObject.password
        });
        generateTokenMock.mockResolvedValueOnce(fakeId);
        const actual = await sut.login(dummyObject.userName, 'wrong password');
        expect(actual).toBeUndefined();

    });
    it('should invalidate token on logout call', async () => {
        await sut.logout(fakeId);
        expect(invalidateTokenMock).toHaveBeenCalledWith(fakeId);
    })
})