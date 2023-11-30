import { v4 } from "uuid";

type stringInfo = {
    lowerCase: string,
    upperCase: string,
    characters: string[],
    length: number,
    extraInfo: Object | undefined
}
type loggerServiceCallBack = (arg: string) => void;

const calculateComplexity = (stringInfo: stringInfo) => {
    return Object.keys(stringInfo.extraInfo).length * stringInfo.length;
}

function toUpperCase(arg: string) {
    return arg.toUpperCase();
}
function toLowerCaseWithId(arg: string) {
    return arg.toLowerCase() + v4();
}
const toUpperCaseWithCb = (arg: string, cb:loggerServiceCallBack) => {
    if(!arg){
        cb('Invalid arg');
        return ;
    }
    cb(`called function with ${arg}`)
    return arg.toUpperCase();
}

class OtherStringUtils {
    //It doesn't appeared in spy because it is private. to use it make cast (as) in test file
    private callExternalService(){
        console.log('call external service');  
    }
    public toUpperCase(str: string) {
        return str.toUpperCase();
    }
    public logString(str: string){
        console.log(str);
    }
}
export {
    calculateComplexity,
    toUpperCaseWithCb,
    loggerServiceCallBack,
    OtherStringUtils,
    toUpperCase,
    toLowerCaseWithId
}