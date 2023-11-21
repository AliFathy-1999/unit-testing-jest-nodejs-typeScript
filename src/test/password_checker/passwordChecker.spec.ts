import { PasswordErrors, passwordChecker } from "../../app/password_checker/passwordChecker"
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
        expect(actual.isValid).toBe(false);
        expect(actual.reasons).toContain(PasswordErrors.SHORT);

    })

    it('Password more than 8 chars is valid',()=>{
        const actual = sut.checkPassword("12345678Aa");
        expect(actual.reasons).not.toContain(PasswordErrors.SHORT);
    })

    it('Has no upperCase letter is invalid',()=>{
        // * step 1: enter invalid password UpperCase
        const actual = sut.checkPassword("12345abc");
        expect(actual.reasons).not.toContain(PasswordErrors.NO_UPPERCASE);
    })

    it('Has upperCase letter is valid',()=>{
        // * step 1: enter invalid password UpperCase
        const actual = sut.checkPassword("abcCaaaaa");
        expect(actual.isValid).toBe(true);
        expect(actual.reasons).not.toContain(PasswordErrors.NO_UPPERCASE);
    })

    it('Has no lowerCase letter is invalid',()=>{
        // * step 1: enter invalid password lowerCase
        const actual = sut.checkPassword("ABCD");
        expect(actual.reasons).toContain(PasswordErrors.NO_UPPERCASE)
    })

    it('Has lowerCase letter is valid',()=>{
        // * step 1: enter invalid password lowerCase
        const actual = sut.checkPassword("ABCDa");
        expect(actual.reasons).not.toContain(PasswordErrors.NO_UPPERCASE)
    })

    it('Complex password is valid', ()=>{
        const actual = sut.checkPassword("Abcd1234!");
        expect(actual.reasons).toHaveLength(0)
        expect(actual.isValid).toBe(true)
    })

    it('Admin password with no number is invalid ',()=>{
        const actual = sut.checkAdminPassword("Abcd1234!");
        expect(actual.reasons).not.toContain(PasswordErrors.NO_NUMBER)
    })
})