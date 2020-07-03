// The auth guard is used to prevent unauthenticated users from accessing restricted routes, it's used in app.routing.ts to protect the home page route
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthenticationService } from './authentication.service';
 
@Injectable()
export class AuthGuarPED implements CanActivate {
 
    constructor(private router: Router ) { }
 
    canActivate() {
        
        let user:any;
        if (localStorage.getItem('currentUser')) {
            user=JSON.parse(localStorage.getItem('currentUser'));
        
            if(user.dashboard){
                return true;
            }else if(this.checkModule('PED',user.modules) || user.supervisor){
                return true;
            }
            this.router.navigate(['/livedashboard']);
            return false;
        }
 
        // not logged in so redirect to login page
        
        this.router.navigate(['/login']);
        return false;
    }

    checkModule(moduleId, modulesArray:Array<String>){
        let returnVal = false;
        modulesArray.forEach(element => {
            if(moduleId === element){
            returnVal = true;
            }
        });
        return returnVal;
    }
}