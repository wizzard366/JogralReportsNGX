import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, Response,URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/throw';
import { Router } from '@angular/router';



@Injectable()
export class PublicServicesService {

    constructor(private http:Http){
           
            
    }
    getServers(){
        let headers = new Headers({});
        let options = new RequestOptions({headers:headers});
        return this.http.get('/api/servers')
            .map(res => res.json()).catch(this.handleError);
    }


    handleError (error: Response | any,obj) {
        let errMsg: string;
        
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
            
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        return Observable.throw(errMsg);
    }
}