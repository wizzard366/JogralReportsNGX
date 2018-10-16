import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/throw';
import { Router } from '@angular/router';

import { AuthenticationService } from './oauth/authentication.service';

@Injectable()
export class LaboratoriesService {

    constructor(private http: Http,
        private authenticationService: AuthenticationService,
        private router: Router) {


    }

    handleError(error: Response | any, obj, router: Router) {
        let errMsg: string;

        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
            if (error.status === 401) {
                localStorage.removeItem('currentUser');
                router.navigate(['/login']);
                console.log("removing current")
            }
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        return Observable.throw(errMsg);
    }

    getLaboratorySales(id, year) {
        let headers = new Headers({ 'x-access-token': this.authenticationService.token, 'db-pool': this.authenticationService.server });
        let options = new RequestOptions({ headers: headers });
        let server = this.authenticationService.server
        return this.http.get('/api/'+server+'/sales/brand/' + id + '/' + year, options)
            .map(res => res.json()).catch((err: Response, obj) => { return this.handleError(err, obj, this.router); });
    }

    getLaboratoryProductSales(id, year) {
        let headers = new Headers({ 'x-access-token': this.authenticationService.token, 'db-pool': this.authenticationService.server });
        let options = new RequestOptions({ headers: headers });
        let server = this.authenticationService.server
        return this.http.get('/api/'+server+'/sales/brand/product/' + id + '/' + year, options)
            .map(res => res.json()).catch((err: Response, obj) => { return this.handleError(err, obj, this.router); });
    }


    getLaboratoryByDescription(description) {
        let headers = new Headers({ 'x-access-token': this.authenticationService.token, 'db-pool': this.authenticationService.server });
        let options = new RequestOptions({ headers: headers });
        let server = this.authenticationService.server
        return this.http.get('/api/'+server+'/brand/' + description, options)
            .map(res => res.json()).catch((err: Response, obj) => { return this.handleError(err, obj, this.router); });
    }


}