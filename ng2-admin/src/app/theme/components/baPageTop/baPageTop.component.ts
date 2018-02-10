import {Component} from '@angular/core';

import {GlobalState} from '../../../global.state';
import {AuthenticationService} from '../../../pages/services/oauth/authentication.service';


@Component({
  selector: 'ba-page-top',
  templateUrl: './baPageTop.html',
  styleUrls: ['./baPageTop.scss']
})
export class BaPageTop {

  public isScrolled:boolean = false;
  public isMenuCollapsed:boolean = false;
  public userName:any;

  constructor(private _state:GlobalState, 
    private authenticationService:AuthenticationService) {
    this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
      this.isMenuCollapsed = isCollapsed;
    });
    this.userName=this.authenticationService.name;
  }

  public toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
    this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
    return false;
  }

  public scrolledChanged(isScrolled) {
    this.isScrolled = isScrolled;
  }
  public logout(){
    this.authenticationService.logout();
  }
}
