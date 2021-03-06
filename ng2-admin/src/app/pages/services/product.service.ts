import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/throw';
import { Router } from '@angular/router';

import { AuthenticationService } from './oauth/authentication.service';

import { SalesMan } from '../reports/salesman';
//import { URLSearchParams } from '@angular/http/src/url_search_params';

@Injectable()
export class ProductService {

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

    getProduct(id) {
        let headers = new Headers({ 'x-access-token': this.authenticationService.token, 'db-pool': this.authenticationService.server });
        let options = new RequestOptions({ headers: headers });
        return this.http.get('/api/producto/' + id, options)
            .map(res => res.json()).catch((err: Response, obj) => { return this.handleError(err, obj, this.router); });
    }

    getProductByDescription(description) {
        let headers = new Headers({ 'x-access-token': this.authenticationService.token, 'db-pool': this.authenticationService.server });
        let options = new RequestOptions({ headers: headers });
        return this.http.get('/api/producto/description/' + description, options)
            .map(res => res.json()).catch((err: Response, obj) => { return this.handleError(err, obj, this.router); });
    }

    getUnitMeasurements(id) {
        let headers = new Headers({ 'x-access-token': this.authenticationService.token, 'db-pool': this.authenticationService.server });
        let options = new RequestOptions({ headers: headers });
        return this.http.get('/api/producto/' + id + '/umedida', options)
            .map(res => res.json()).catch((err: Response, obj) => { return this.handleError(err, obj, this.router); });
    }

    getPrices(pid, umedidaid, umedidadesc) {
        let headers = new Headers({ 'x-access-token': this.authenticationService.token, 'db-pool': this.authenticationService.server });
        let options = new RequestOptions({ headers: headers });
        return this.http.get('/api/precios/producto/' + pid + '/umedida/' + umedidaid + '/' + umedidadesc, options)
            .map(res => res.json()).catch((err: Response, obj) => { return this.handleError(err, obj, this.router); });
    }

    getPriceRanges(pid, umedidaid, umedidadesc, priceTypeId) {
        let headers = new Headers({ 'x-access-token': this.authenticationService.token, 'db-pool': this.authenticationService.server });
        let options = new RequestOptions({ headers: headers });
        return this.http.get('/api/precios/rangos/producto/' + pid + '/umedida/' + umedidaid + '/' + umedidadesc + '/pricetype/' + priceTypeId, options)
            .map(res => res.json()).catch((err: Response, obj) => { return this.handleError(err, obj, this.router); });
    }

    getStock(pid, factor) {
        let headers = new Headers({ 'x-access-token': this.authenticationService.token, 'db-pool': this.authenticationService.server });
        let options = new RequestOptions({ headers: headers });
        return this.http.get('/api/producto/' + pid + '/existencias/umedida/factor/' + factor, options)
            .map(res => res.json()).catch((err: Response, obj) => { return this.handleError(err, obj, this.router); });
    }

    getSalesPerYear(year) {
        let headers = new Headers({ 'x-access-token': this.authenticationService.token, 'db-pool': this.authenticationService.server });
        let options = new RequestOptions({ headers: headers });
        return this.http.get('/api/sales/year/' + year, options)
            .map(res => res.json()).catch((err: Response, obj) => { return this.handleError(err, obj, this.router); });
    }

    getSalesByBrand() {
        let headers = new Headers({ 'x-access-token': this.authenticationService.token, 'db-pool': this.authenticationService.server });
        let options = new RequestOptions({ headers: headers });
        return this.http.get('/api/sales/brand', options)
            .map(res => res.json()).catch((err: Response, obj) => { return this.handleError(err, obj, this.router); });
    }

    getSalesByProduct(pid, startDate, endDate) {

        let headers = new Headers({ 'x-access-token': this.authenticationService.token, 'db-pool': this.authenticationService.server });
        let params = new URLSearchParams();
        params.append('startDate', encodeURIComponent(startDate));
        params.append('endDate', encodeURIComponent(endDate));
        let options = new RequestOptions({ headers: headers, search: params });
        return this.http.get('/api/producto/' + pid + '/ventas', options)
            .map(res => res.json()).catch((err: Response, obj) => { return this.handleError(err, obj, this.router); });
    }

    getSalesBySalesMan() {
        let headers = new Headers({ 'x-access-token': this.authenticationService.token, 'db-pool': this.authenticationService.server });
        let options = new RequestOptions({ headers: headers });
        return this.http.get('/api/sales/salesman', options)
            .map(res => res.json()).catch((err: Response, obj) => { return this.handleError(err, obj, this.router); });
    }

    getSalesBySalesManProyectionsAll() {
        let headers = new Headers({ 'x-access-token': this.authenticationService.token, 'db-pool': this.authenticationService.server });
        let options = new RequestOptions({ headers: headers });
        return this.http.get('/api/sales/salesman/proyections', options)
            .map(res => res.json()).catch((err: Response, obj) => { return this.handleError(err, obj, this.router); });

    }
    getSalesBySalesManProyectionsByYear(year) {
        let headers = new Headers({ 'x-access-token': this.authenticationService.token, 'db-pool': this.authenticationService.server });
        let options = new RequestOptions({ headers: headers });
        return this.http.get('/api/sales/salesman/proyections/' + year, options)
            .map(res => res.json()).catch((err: Response, obj) => { return this.handleError(err, obj, this.router); });

    }
    getTopClientsBySalesman(salesmanId, year, month) {
        let headers = new Headers({ 'x-access-token': this.authenticationService.token, 'db-pool': this.authenticationService.server });
        let options = new RequestOptions({ headers: headers });
        return this.http.get('/api/sales/salesman/' + salesmanId + '/topclients/' + year + '/' + month, options)
            .map(res => res.json()).catch((err: Response, obj) => { return this.handleError(err, obj, this.router); });

    }
    getLast3YearsSalesByProduct(pid) {
        let headers = new Headers({ 'x-access-token': this.authenticationService.token, 'db-pool': this.authenticationService.server });
        let options = new RequestOptions({ headers: headers });
        return this.http.get('/api/producto/' + pid + '/yearsales/', options)
            .map(res => res.json()).catch((err: Response, obj) => { return this.handleError(err, obj, this.router); });

    }

    getSalesByProductIdAndVendedorIdByDateInterval(pid, startDate, endDate) {
        console.log("start:" + startDate + "hasta:" + endDate);
        let headers = new Headers({ 'x-access-token': this.authenticationService.token, 'db-pool': this.authenticationService.server });
        let params = new URLSearchParams();
        params.append('startDate', encodeURIComponent(startDate));
        params.append('endDate', encodeURIComponent(endDate));
        let options = new RequestOptions({ headers: headers, search: params });
        return this.http.get('/api/sales/byproductandseller/' + pid + '/', options)
            .map(res => res.json()).catch((err: Response, obj) => { return this.handleError(err, obj, this.router); });
    }
    //****************************************************************************************************************************************** */
    getSellers() {
        let headers = new Headers({ 'x-access-token': this.authenticationService.token, 'db-pool': this.authenticationService.server });
        let options = new RequestOptions({ headers: headers });
        return this.http.get('/api/sellers/', options)
            .map(res => res.json()).catch((err: Response, obj) => { return this.handleError(err, obj, this.router); });

    }
}