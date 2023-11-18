
class stringUtils {
    toUpperCase(str: string): string {
        // if(!str) throw new Error("Invalid String"); // Use Done If comment it.
        if(!str) throw new Error("Invalid String");
        return toUpperCase(str);
    }
}


function toUpperCase(str: string): string {
    return str.toUpperCase();
}


type stringInfo = {
    lowerCase: string,
    upperCase: string,
    characters: string[],
    length: number,
    extraInfo: Object | undefined
}

function getStringInfo(arg: string): stringInfo{
    return {
        lowerCase: arg.toLowerCase(),
        upperCase: arg.toUpperCase(),
        characters: Array.from(arg),
        length: arg.length,
        extraInfo: {}
    }
}

export {
    toUpperCase,
    getStringInfo,
    stringInfo,
    stringUtils
}
