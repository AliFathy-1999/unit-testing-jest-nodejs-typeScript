import { HTTP_CODES, HTTP_METHODS } from "../../../app/server_app/model/ServerModel";

export class ResponseTestWrapper {
    public statusCode: HTTP_CODES;
    public headers = new Array<object>();
    public body: { [key: string]: any };
    public writeHead(statusCode: HTTP_CODES, header: { [key: string]: string }){ 
        this.statusCode = statusCode;
        this.headers.push(header);
    }
    public write(stringifiedBody: string){
        this.body = JSON.parse(stringifiedBody);
    }
    public end(){
        
    }
    public clearFields(){
        this.statusCode = undefined;
        this.headers = [];
        this.body = undefined;
    }
}