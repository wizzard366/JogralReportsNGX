import { Component } from '@angular/core';
import { BaMenuService } from '../../theme';
import { Routes } from '@angular/router';

@Component({
  selector: 'pos-component',
  templateUrl: 'pos.component.html'
})
export class PosComponent {

    public PAGES_POS = [
        {
          path: 'pos',
          children: [
            {
              path: 'grupos',  // path for our page
              data: { // custom menu declaration
                menu: {
                  title: 'Grupos', // menu title
                  icon: 'fa fa fa-bar-chart', // menu icon
                  pathMatch: 'prefix', // use it if item children not displayed in menu
                  selected: false,
                  expanded: false,
                  order: 0
                }
              }
            }]
        }
    ]

    constructor(private _menuService: BaMenuService){
        
    }

    ngOnInit() {
        this._menuService.updateMenuByRoutes(<Routes>this.PAGES_POS);
    }

}