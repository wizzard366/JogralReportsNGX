import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/throw';
import { Router } from '@angular/router';

import {AuthenticationService} from './oauth/authentication.service';


@Injectable()
export class ClientsService {
    
    constructor(private http:Http,
    private authenticationService:AuthenticationService,
    private router: Router){
       
    }

    handleError (error: Response | any,obj) {
        let errMsg: string;
        
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
            if (error.status === 401 ){
               localStorage.removeItem('currentUser');
            }
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        return Observable.throw(errMsg);
    }


    getClientsByName(name){
        let headers = new Headers({'x-access-token':this.authenticationService.token});
        let options = new RequestOptions({headers:headers});
        return this.http.get('/api/clients/'+name,options)
            .map(res => res.json()).catch(this.handleError);
    }

    getClientInfo(id,year){
        let headers = new Headers({'x-access-token':this.authenticationService.token});
        let options = new RequestOptions({headers:headers});
        return this.http.get('/api/clients/salesperyear/'+year+'/'+id,options)
            .map(res => res.json()).catch(this.handleError);   

    }

    getTopClients(year){
        let headers = new Headers({'x-access-token':this.authenticationService.token});
        let options = new RequestOptions({headers:headers});
        return this.http.get('/api/clients/top/salesperyear/'+year,options)
            .map(res => res.json()).catch(this.handleError);   

    }


}