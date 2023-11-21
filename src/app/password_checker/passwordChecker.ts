
enum PasswordErrors {
    SHORT = "Password is too short",
    NO_UPPERCASE = 'Upper case letter required!',
    NO_LOWERCASE = 'Lower case letter required!',
    NO_NUMBER = 'At least one number required!',
}

interface CheckResult {
    isValid: boolean;
    reasons: PasswordErrors[];
}

class passwordChecker {
    public checkPassword(password: string) : CheckResult {
        const reasons: PasswordErrors[] = [];

        // ** Step 2: After run test and fail due to expected false put received true, Resolve this problem be checking on length < 8.
        this.checkPasswordLength(password, reasons);
        
        // ** Step 2: After run test and fail due to expected false put received true, Resolve this problem be checking on upperCase.
        this.checkPasswordUpperCase(password, reasons);
        
        // ** Step 2: After run test and fail due to expected false put received true, Resolve this problem be checking on lowerCase.
        this.checkPasswordLowerCase(password, reasons);
        
        
        return {
            isValid: reasons.length > 0 ? false : true,
            reasons,
        };
    }

    private checkPasswordLength  (password: string, reasons: PasswordErrors[])  {
        if(password.length < 8)
            reasons.push(PasswordErrors.SHORT);
        return reasons
    }

    private checkPasswordLowerCase (password: string, reasons: PasswordErrors[])  {
        if(password === password.toLowerCase())
            reasons.push(PasswordErrors.NO_LOWERCASE);
        return reasons
    }

    private checkPasswordUpperCase (password: string, reasons: PasswordErrors[])  {
        if(password === password.toUpperCase())
            reasons.push(PasswordErrors.NO_UPPERCASE);
        return reasons
    }
    private checkOnNumber (password: string, reasons: PasswordErrors[]) {
        const hasNumber = /\d/
        if(!hasNumber.test(password))
            reasons.push(PasswordErrors.NO_NUMBER);
        return reasons
    }
    public checkAdminPassword (password: string):CheckResult  {
        const basicCheck = this.checkPassword(password);
        const checkNumber = this.checkOnNumber(password, basicCheck.reasons);
        return {
            isValid: checkNumber.length > 0 ? false : true,
            reasons: basicCheck.reasons
        }
    }
}



export {
    passwordChecker,
    CheckResult,
    PasswordErrors,
}