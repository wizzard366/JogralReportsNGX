import { Injectable } from '@angular/core';
import { Http, Headers, Response,RequestOptions  } from '@angular/http';
import { Observable } from 'rxjs';
import { Router, CanActivate } from '@angular/router';
import 'rxjs/add/operator/map'
 
@Injectable()
export class AuthenticationService {
    public token: string;
    public name: string;
    public corre: string;
    public server: string;
    public supervisor: any;
    public modules: any;
    public autoriza: any; 
    public dashboard:any;

    constructor(private http: Http,private router: Router) {
        // set token if saved in local storage
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        this.token = currentUser && currentUser.token;
        this.server = currentUser && currentUser.server;

    }
 
    login(username: string, password: string, server:string): Observable<boolean> {
        console.log("server",server);
        let body = `username=${username}&password=${password}`;
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
        return this.http.post('/api/'+server+'/authenticate/', body, { headers: headers })
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let responseJson = response.json();
                let token = responseJson && responseJson.token;
                let name = responseJson.name;
                let corre = responseJson.corre;
                let supervisor = responseJson.supervisor;
                let modules = responseJson.modules;
                let autoriza = responseJson.autoriza;
                let dashboard = responseJson.dashboard;
                let store = server;
                if (token) {
                    // set token property
                    this.token = token;
                    this.name = name;
                    this.corre = corre;
                    this.server = store;
                    this.autoriza = autoriza;
                    this.supervisor = supervisor;
                    this.modules = modules;
                    this.dashboard = dashboard;
                    
                    // store username and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify({ username: username, token: token, name:name,corre:corre, server:store, autoriza:autoriza,dashboard:dashboard,supervisor:supervisor,modules:modules }));
                    
                    // return true to indicate successful login
                    console.log('login service',true)
                    return true;
                } else {
                    // return false to indicate failed login
                    console.log('login service',false)
                    return false;
                }
            });
    }
 
    logout(): void {
        // clear token remove user from local storage to log user out
        
        this.token = null;
        localStorage.removeItem('currentUser');
        
    }

    public changeServer(server){
        this.server = server;
        console.log('change server to:',server)

        let currentUser = JSON.parse(localStorage.getItem('currentUser'))
        currentUser.server = server
        localStorage.setItem('currentUser', JSON.stringify(currentUser))
        this.router.navigate(['/']);
    }


    
}