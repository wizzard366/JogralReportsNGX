import { Injectable } from '@angular/core';
import { Http, Headers, Response,RequestOptions  } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'
 
@Injectable()
export class AuthenticationService {
    public token: string;
    public name: string;
    public corre: string;
    public server: string;
 
    constructor(private http: Http) {
        // set token if saved in local storage
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        this.token = currentUser && currentUser.token;
        this.server = currentUser && currentUser.server;

    }
 
    login(username: string, password: string, server:string): Observable<boolean> {
        let body = `username=${username}&password=${password}`;
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
        return this.http.post('/api/'+server+'/authenticate/', body, { headers: headers })
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let token = response.json() && response.json().token;
                let name = response.json().name;
                let corre = response.json().corre;
                let store = server;
                if (token) {
                    // set token property
                    this.token = token;
                    this.name = name;
                    this.corre = corre;
                    this.server = store;
                    // store username and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify({ username: username, token: token, name:name,corre:corre, server:store }));
                    
                    // return true to indicate successful login
                    return true;
                } else {
                    // return false to indicate failed login
                    return false;
                }
            });
    }
 
    logout(): void {
        // clear token remove user from local storage to log user out
        
        this.token = null;
        localStorage.removeItem('currentUser');
        
    }
}