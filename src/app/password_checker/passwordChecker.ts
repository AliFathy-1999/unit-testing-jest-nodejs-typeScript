
enum PasswordErrors {
    SHORT = "Password is too short",
    NO_UPPERCASE = 'Upper case letter required!',
    NO_LOWERCASE = 'Lower case letter required!',
}

interface CheckResult {
    isValid: boolean;
    reasons: PasswordErrors[];
}

class passwordChecker {
    public checkPassword(password: string) : CheckResult {
        const reasons: PasswordErrors[] = [];

        // ** Step 2: After run test and fail due to expected false put received true, Resolve this problem be checking on length < 8.
        if(password.length < 8)
            reasons.push(PasswordErrors.SHORT);
        if(password === password.toUpperCase())
        // ** Step 2: After run test and fail due to expected false put received true, Resolve this problem be checking on lowerCase.
            reasons.push(PasswordErrors.NO_UPPERCASE)
        if(password === password.toLowerCase())
        // ** Step 2: After run test and fail due to expected false put received true, Resolve this problem be checking on lowerCase.
            reasons.push(PasswordErrors.NO_LOWERCASE)
        return {
            isValid: reasons.length > 0 ? false : true,
            reasons,
        };
    }
}

export {
    passwordChecker,
    CheckResult,
    PasswordErrors,
}