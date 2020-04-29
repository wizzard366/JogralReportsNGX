import { Routes, RouterModule }  from '@angular/router';
import { SimplePricesComponent } from './simple.prices.component';

const routes: Routes = [
  {
    path: '',
    component: SimplePricesComponent
  }
];

export const routing = RouterModule.forChild(routes);