import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/throw';
import { Router } from '@angular/router';

import {AuthenticationService} from './oauth/authentication.service';

import { SalesMan } from '../reports/salesman';

@Injectable()
export class DateService {
    
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


    getServerDate(){
        let headers = new Headers({'x-access-token':this.authenticationService.token});
        let options = new RequestOptions({headers:headers});
        return this.http.get('/api/date',options)
            .map(res => res.json()).catch(this.handleError);
    }
}