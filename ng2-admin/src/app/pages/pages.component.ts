import { Component, OnInit } from '@angular/core';
import { Routes } from '@angular/router';

import { BaMenuService } from '../theme';
import { PAGES_MENU } from './pages.menu';

@Component({
  selector: 'pages',
  templateUrl: './pages.component.html',
  /* styles: [`
    .banner-container {
      position: fixed;
      bottom: 50px;
      right: 50px;
      width: 568px;
      height: 322px;
      background-image: url('assets/img/ngx-admin-banner.png');
      background-size: contain;
    }
    .banner {
      position: relative;
      width: 100%;
      height: 100%;
    }
    .title {
      position: absolute;
      top: 40px;
      left: 10%;
      width: 80%;
      text-align: center;
      font-size: 1.75rem;
      line-height: 1.25;
      color: #ffffff;
    }
    .close {
      position: absolute;
      top: 10px;
      right: 10px;
      padding: 10px;
      cursor: pointer;
      text-shadow: none;
      color: #ffffff;
      font-size: 1rem;
    }
  `], */
})
export class Pages implements OnInit {

  constructor(private _menuService: BaMenuService) {
  }

  ngOnInit() {
    this._menuService.updateMenuByRoutes(<Routes>PAGES_MENU);
  }

  showBanner() {
    return !localStorage.getItem('hideBanner');
  }

  closeBanner(event: any) {
    localStorage.setItem('hideBanner', 'true');
    event.preventDefault();
    event.stopPropagation();
  }
}
