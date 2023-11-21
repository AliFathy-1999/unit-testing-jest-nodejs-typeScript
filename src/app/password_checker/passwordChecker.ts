
export class passwordChecker {
    public checkPassword(password: string) : boolean {
        // ** Step 2: After run test and fail due to expected false put received true, Resolve this problem be checking on length < 8.
        if(password.length < 8)
            return false;
        // ** Step 2: After run test and fail due to expected false put received true, Resolve this problem be checking on upperCase.
        if(password === password.toUpperCase())
            return false;
        
        // ** Step 2: After run test and fail due to expected false put received true, Resolve this problem be checking on lowerCase.
        if(password === password.toLowerCase())
            return false;

        return true;
    }
}