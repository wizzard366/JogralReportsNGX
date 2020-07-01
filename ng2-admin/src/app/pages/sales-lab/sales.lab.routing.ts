import { Routes, RouterModule }  from '@angular/router';
import { SalesLabComponent } from './sales.lab.component';

const routes: Routes = [
  {
    path: '',
    component: SalesLabComponent
  }
];

export const routing = RouterModule.forChild(routes);