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
export class ProductService {
    
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

    getProduct(id){
        let headers = new Headers({'x-access-token':this.authenticationService.token});
        let options = new RequestOptions({headers:headers});
        return this.http.get('/api/producto/'+id,options)
            .map(res => res.json()).catch(this.handleError);
    }

    getProductByDescription(description){
        let headers = new Headers({'x-access-token':this.authenticationService.token});
        let options = new RequestOptions({headers:headers});
        return this.http.get('/api/producto/description/'+description,options)
            .map(res => res.json()).catch(this.handleError);
    }

    getUnitMeasurements(id){
        let headers = new Headers({'x-access-token':this.authenticationService.token});
        let options = new RequestOptions({headers:headers});
        return this.http.get('/api/producto/'+id+'/umedida',options)
            .map(res => res.json()).catch(this.handleError);
    }
    
    getPrices(pid,umedidaid,umedidadesc){
        let headers = new Headers({'x-access-token':this.authenticationService.token});
        let options = new RequestOptions({headers:headers});
        return this.http.get('/api/precios/producto/'+pid+'/umedida/'+umedidaid+'/'+umedidadesc,options)
            .map(res => res.json()).catch(this.handleError);
    }

    getPriceRanges(pid,umedidaid,umedidadesc,priceTypeId){
        let headers = new Headers({'x-access-token':this.authenticationService.token});
        let options = new RequestOptions({headers:headers});
        return this.http.get('/api/precios/rangos/producto/'+pid+'/umedida/'+umedidaid+'/'+umedidadesc+'/pricetype/'+priceTypeId,options)
            .map(res => res.json()).catch(this.handleError);
    }
    
    getStock(pid,factor){
        let headers = new Headers({'x-access-token':this.authenticationService.token});
        let options = new RequestOptions({headers:headers});
        return this.http.get('/api/producto/' + pid + '/existencias/umedida/factor/' + factor,options)
            .map(res => res.json()).catch(this.handleError);
    }

    getSalesPerYear(year){
        let headers = new Headers({'x-access-token':this.authenticationService.token});
        let options = new RequestOptions({headers:headers});
        return this.http.get('/api/sales/year/' + year ,options)
            .map(res => res.json()).catch(this.handleError);
    }

    getSalesByBrand(){
        let headers = new Headers({'x-access-token':this.authenticationService.token});
        let options = new RequestOptions({headers:headers});
        return this.http.get('/api/sales/brand',options)
            .map(res => res.json()).catch(this.handleError);
    }

    getSalesBySalesMan(){
        let headers = new Headers({'x-access-token':this.authenticationService.token});
        let options = new RequestOptions({headers:headers});
        return this.http.get('/api/sales/salesman',options)
            .map(res => res.json()).catch(this.handleError);
    }

    getSalesBySalesManProyectionsAll(){
        let headers = new Headers({'x-access-token':this.authenticationService.token});
        let options = new RequestOptions({headers:headers});
        return this.http.get('/api/sales/salesman/proyections',options)
            .map(res => res.json()).catch(this.handleError);
        
    }
    getSalesBySalesManProyectionsByYear(year){
        let headers = new Headers({'x-access-token':this.authenticationService.token});
        let options = new RequestOptions({headers:headers});
        return this.http.get('/api/sales/salesman/proyections/'+year,options)
            .map(res => res.json()).catch(this.handleError);
        
    }

//****************************************************************************************************************************************** */
   
}