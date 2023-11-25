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

const toUpperCaseWithCb = (arg: string, cb:loggerServiceCallBack) => {
    if(!arg){
        cb('Invalid arg');
        return ;
    }
    cb(`called function with ${arg}`)
    return arg.toUpperCase();
}
export {
    calculateComplexity,
    toUpperCaseWithCb,
    loggerServiceCallBack
}