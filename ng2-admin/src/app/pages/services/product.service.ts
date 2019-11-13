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
        let server = this.authenticationService.server
        return this.http.get('/api/'+server+'/producto/' + id, options)
            .map(res => res.json()).catch((err: Response, obj) => { return this.handleError(err, obj, this.router); });
    }

    getProductByDescription(description) {
        let headers = new Headers({ 'x-access-token': this.authenticationService.token, 'db-pool': this.authenticationService.server });
        let options = new RequestOptions({ headers: headers });
        let server = this.authenticationService.server
        return this.http.get('/api/'+server+'/producto/description/' + description, options)
            .map(res => res.json()).catch((err: Response, obj) => { return this.handleError(err, obj, this.router); });
    }

    getUnitMeasurements(id) {
        let headers = new Headers({ 'x-access-token': this.authenticationService.token, 'db-pool': this.authenticationService.server });
        let options = new RequestOptions({ headers: headers });
        let server = this.authenticationService.server
        return this.http.get('/api/'+server+'/producto/' + id + '/umedida', options)
            .map(res => res.json()).catch((err: Response, obj) => { return this.handleError(err, obj, this.router); });
    }

    getPrices(pid, umedidaid, umedidadesc) {
        let headers = new Headers({ 'x-access-token': this.authenticationService.token, 'db-pool': this.authenticationService.server });
        let options = new RequestOptions({ headers: headers });
        let server = this.authenticationService.server
        return this.http.get('/api/'+server+'/precios/producto/' + pid + '/umedida/' + umedidaid + '/' + umedidadesc, options)
            .map(res => res.json()).catch((err: Response, obj) => { return this.handleError(err, obj, this.router); });
    }

    getPriceRanges(pid, umedidaid, umedidadesc, priceTypeId) {
        let headers = new Headers({ 'x-access-token': this.authenticationService.token, 'db-pool': this.authenticationService.server });
        let options = new RequestOptions({ headers: headers });
        let server = this.authenticationService.server
        return this.http.get('/api/'+server+'/precios/rangos/producto/' + pid + '/umedida/' + umedidaid + '/' + umedidadesc + '/pricetype/' + priceTypeId, options)
            .map(res => res.json()).catch((err: Response, obj) => { return this.handleError(err, obj, this.router); });
    }

    getStock(pid, factor) {
        let headers = new Headers({ 'x-access-token': this.authenticationService.token, 'db-pool': this.authenticationService.server });
        let options = new RequestOptions({ headers: headers });
        let server = this.authenticationService.server
        return this.http.get('/api/'+server+'/producto/' + pid + '/existencias/umedida/factor/' + factor, options)
            .map(res => res.json()).catch((err: Response, obj) => { return this.handleError(err, obj, this.router); });
    }

    getSalesPerYear(year) {
        let headers = new Headers({ 'x-access-token': this.authenticationService.token, 'db-pool': this.authenticationService.server });
        let options = new RequestOptions({ headers: headers });
        let server = this.authenticationService.server
        return this.http.get('/api/'+server+'/sales/year/' + year, options)
            .map(res => res.json()).catch((err: Response, obj) => { return this.handleError(err, obj, this.router); });
    }

    getSalesByBrand() {
        let headers = new Headers({ 'x-access-token': this.authenticationService.token, 'db-pool': this.authenticationService.server });
        let options = new RequestOptions({ headers: headers });
        let server = this.authenticationService.server
        return this.http.get('/api/'+server+'/sales/brand', options)
            .map(res => res.json()).catch((err: Response, obj) => { return this.handleError(err, obj, this.router); });
    }

    getSalesByProduct(pid, startDate, endDate) {

        let headers = new Headers({ 'x-access-token': this.authenticationService.token, 'db-pool': this.authenticationService.server });
        let params = new URLSearchParams();
        params.append('startDate', encodeURIComponent(startDate));
        params.append('endDate', encodeURIComponent(endDate));
        let options = new RequestOptions({ headers: headers, search: params });
        let server = this.authenticationService.server
        return this.http.get('/api/'+server+'/producto/' + pid + '/ventas', options)
            .map(res => res.json()).catch((err: Response, obj) => { return this.handleError(err, obj, this.router); });
    }

    getSalesBySalesMan() {
        let headers = new Headers({ 'x-access-token': this.authenticationService.token, 'db-pool': this.authenticationService.server });
        let options = new RequestOptions({ headers: headers });
        let server = this.authenticationService.server
        return this.http.get('/api/'+server+'/sales/salesman', options)
            .map(res => res.json()).catch((err: Response, obj) => { return this.handleError(err, obj, this.router); });
    }

    getSalesBySalesManProyectionsAll() {
        let headers = new Headers({ 'x-access-token': this.authenticationService.token, 'db-pool': this.authenticationService.server });
        let options = new RequestOptions({ headers: headers });
        let server = this.authenticationService.server
        return this.http.get('/api/'+server+'/sales/salesman/proyections', options)
            .map(res => res.json()).catch((err: Response, obj) => { return this.handleError(err, obj, this.router); });

    }
    getSalesBySalesManProyectionsByYear(year) {
        let headers = new Headers({ 'x-access-token': this.authenticationService.token, 'db-pool': this.authenticationService.server });
        let options = new RequestOptions({ headers: headers });
        let server = this.authenticationService.server
        return this.http.get('/api/'+server+'/sales/salesman/proyections/' + year, options)
            .map(res => res.json()).catch((err: Response, obj) => { return this.handleError(err, obj, this.router); });

    }
    getTopClientsBySalesman(salesmanId, year, month) {
        let headers = new Headers({ 'x-access-token': this.authenticationService.token, 'db-pool': this.authenticationService.server });
        let options = new RequestOptions({ headers: headers });
        let server = this.authenticationService.server
        return this.http.get('/api/'+server+'/sales/salesman/' + salesmanId + '/topclients/' + year + '/' + month, options)
            .map(res => res.json()).catch((err: Response, obj) => { return this.handleError(err, obj, this.router); });

    }
    getLast3YearsSalesByProduct(pid) {
        let headers = new Headers({ 'x-access-token': this.authenticationService.token, 'db-pool': this.authenticationService.server });
        let options = new RequestOptions({ headers: headers });
        let server = this.authenticationService.server
        return this.http.get('/api/'+server+'/producto/' + pid + '/yearsales/', options)
            .map(res => res.json()).catch((err: Response, obj) => { return this.handleError(err, obj, this.router); });

    }

    getSalesByProductIdAndVendedorIdByDateInterval(pid, startDate, endDate) {
        console.log("start:" + startDate + "hasta:" + endDate);
        let headers = new Headers({ 'x-access-token': this.authenticationService.token, 'db-pool': this.authenticationService.server });
        let params = new URLSearchParams();
        let server = this.authenticationService.server
        params.append('startDate', encodeURIComponent(startDate));
        params.append('endDate', encodeURIComponent(endDate));
        let options = new RequestOptions({ headers: headers, search: params });
        return this.http.get('/api/'+server+'/sales/byproductandseller/' + pid + '/', options)
            .map(res => res.json()).catch((err: Response, obj) => { return this.handleError(err, obj, this.router); });
    }
    //****************************************************************************************************************************************** */
    getSellers() {
        let headers = new Headers({ 'x-access-token': this.authenticationService.token, 'db-pool': this.authenticationService.server });
        let options = new RequestOptions({ headers: headers });
        let server = this.authenticationService.server
        return this.http.get('/api/'+server+'/sellers/', options)
            .map(res => res.json()).catch((err: Response, obj) => { return this.handleError(err, obj, this.router); });

    }


    getAreaByDescription(description) {
        let headers = new Headers({ 'x-access-token': this.authenticationService.token, 'db-pool': this.authenticationService.server });
        let options = new RequestOptions({ headers: headers });
        let server = this.authenticationService.server
        return this.http.get('/api/'+server+'/area/description/' + description, options)
            .map(res => res.json()).catch((err: Response, obj) => { return this.handleError(err, obj, this.router); });
    }

    getSubAreaById(areaid) {
        let headers = new Headers({ 'x-access-token': this.authenticationService.token, 'db-pool': this.authenticationService.server });
        let options = new RequestOptions({ headers: headers });
        let server = this.authenticationService.server
        return this.http.get('/api/'+server+'/subarea/description/' + areaid, options)
            .map(res => res.json()).catch((err: Response, obj) => { return this.handleError(err, obj, this.router); });
    }

    getMarcaByDescription(description) {
        let headers = new Headers({ 'x-access-token': this.authenticationService.token, 'db-pool': this.authenticationService.server });
        let options = new RequestOptions({ headers: headers });
        let server = this.authenticationService.server
        return this.http.get('/api/'+server+'/marca/description/' + description, options)
            .map(res => res.json()).catch((err: Response, obj) => { return this.handleError(err, obj, this.router); });
    }

    getClienteByNameOrId(description) {
        let headers = new Headers({ 'x-access-token': this.authenticationService.token, 'db-pool': this.authenticationService.server });
        let options = new RequestOptions({ headers: headers });
        let server = this.authenticationService.server
        return this.http.get('/api/'+server+'/cliente/description/' + description, options)
            .map(res => res.json()).catch((err: Response, obj) => { return this.handleError(err, obj, this.router); });
    }

    getDeptoByDescription(description) {
        let headers = new Headers({ 'x-access-token': this.authenticationService.token, 'db-pool': this.authenticationService.server });
        let options = new RequestOptions({ headers: headers });
        let server = this.authenticationService.server
        return this.http.get('/api/'+server+'/depto/description/' + description, options)
            .map(res => res.json()).catch((err: Response, obj) => { return this.handleError(err, obj, this.router); });
    }

    getMuniByDescription(description) {
        let headers = new Headers({ 'x-access-token': this.authenticationService.token, 'db-pool': this.authenticationService.server });
        let options = new RequestOptions({ headers: headers });
        let server = this.authenticationService.server
        return this.http.get('/api/'+server+'/muni/description/' + description, options)
            .map(res => res.json()).catch((err: Response, obj) => { return this.handleError(err, obj, this.router); });
    }

    getVendedorByDescription(description) {
        let headers = new Headers({ 'x-access-token': this.authenticationService.token, 'db-pool': this.authenticationService.server });
        let options = new RequestOptions({ headers: headers });
        let server = this.authenticationService.server
        return this.http.get('/api/'+server+'/vendedor/description/' + description, options)
            .map(res => res.json()).catch((err: Response, obj) => { return this.handleError(err, obj, this.router); });
    }

    getProductsByMarca(marcaid) {
        let headers = new Headers({ 'x-access-token': this.authenticationService.token, 'db-pool': this.authenticationService.server });
        let options = new RequestOptions({ headers: headers });
        let server = this.authenticationService.server
        return this.http.get('/api/'+server+'/productsbymarca/' + marcaid, options)
            .map(res => res.json()).catch((err: Response, obj) => { return this.handleError(err, obj, this.router); });
    }
    
}