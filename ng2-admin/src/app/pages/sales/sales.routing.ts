import { Routes, RouterModule }  from '@angular/router';
import { SalesComponent } from './sales.component';

const routes: Routes = [
  {
    path: '',
    component: SalesComponent
  }
];

export const routing = RouterModule.forChild(routes);