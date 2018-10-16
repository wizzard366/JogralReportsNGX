import { Routes, RouterModule }  from '@angular/router';
import { PurchasesComponent } from './purchases.component';

const routes: Routes = [
  {
    path: '',
    component: PurchasesComponent
  }
];

export const routing = RouterModule.forChild(routes);