import { HTTP_METHODS } from "../../../app/server_app/model/ServerModel";

export class RequestTestWrapper {
    public body: { [key: string]: any };
    public method: HTTP_METHODS;
    public headers: { [key: string]: string };
    public url: string;

    public on(event, cb){
        if(event === 'data'){
            cb(JSON.stringify(this.body));
        }
        if(event === 'end'){
            cb();
        }
    }
    public clearFields(){
        this.body = undefined;
        this.method = undefined;
        this.headers = {};
        this.url = undefined;
    }
}