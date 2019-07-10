import {Component} from '@angular/core';

import {GlobalState} from '../../../global.state';
import {AuthenticationService} from '../../../pages/services/oauth/authentication.service';
import { PublicServicesService } from '../../../pages/services/public-services.service'
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'ba-page-top',
  templateUrl: './baPageTop.html',
  styleUrls: ['./baPageTop.scss'],
  providers: [PublicServicesService]
})
export class BaPageTop {

  public isScrolled:boolean = false;
  public isMenuCollapsed:boolean = false;
  public userName:any;
  public currentStore:any;
  public serverList:any;

  constructor(private _state:GlobalState, 
    private authenticationService:AuthenticationService,
    private publicServicesService: PublicServicesService) {
    this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
      this.isMenuCollapsed = isCollapsed;
    });
    this.userName=this.authenticationService.name;
    this.setStoreName()
  }

  private setStoreName(){
    this.publicServicesService.getServers().subscribe(servers=>{

      let currentStore = this.authenticationService.server
      this.serverList = servers;
      servers.forEach(element=>{
        if(element.index === currentStore){
          this.currentStore = element.name;
        }
      })
    })
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

  public changeServer(server){
    this.setStoreName();
    this.authenticationService.changeServer(server);
  }
}
