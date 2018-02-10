import { Routes, RouterModule }  from '@angular/router';
import { SellersComponent } from './sellers.component';

const routes: Routes = [
  {
    path: '',
    component: SellersComponent
  }
];

export const routing = RouterModule.forChild(routes);