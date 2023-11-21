import { passwordChecker } from "../../app/password_checker/passwordChecker"
/*
    A password is invalid if:
    *   Length is less than 8 characters
    *   Has no upperCase letter
    *   Has no lowerCase letter
*/
describe('PasswordChecker testing', ()=>{
    let sut: passwordChecker;

    beforeEach(()=>{
        sut = new passwordChecker() 
    })

    afterEach(()=>{
        sut = null;
    })
    it('Length is less than 8 characters is invalid',()=>{
        // * step 1: enter invalid password 7 letters
        const actual = sut.checkPassword("1234567");
        expect(actual).toBe(false);
    })

    it('Password more than 8 chars is valid',()=>{
        const actual = sut.checkPassword("12345678Aa");
        expect(actual).toBe(true);
    })

    it('Has no upperCase letter is invalid',()=>{
        // * step 1: enter invalid password UpperCase
        const actual = sut.checkPassword("12345abc");
        expect(actual).toBe(false);
    })

    it('Has upperCase letter is valid',()=>{
        // * step 1: enter invalid password UpperCase
        const actual = sut.checkPassword("12345abC");
        expect(actual).toBe(true);
    })

    it('Has no lowerCase letter is invalid',()=>{
        // * step 1: enter invalid password lowerCase
        const actual = sut.checkPassword("1234ABCD");
        expect(actual).toBe(false);
    })

    it('Has lowerCase letter is valid',()=>{
        // * step 1: enter invalid password lowerCase
        const actual = sut.checkPassword("aliFathi");
        expect(actual).toBe(true);
    })
})