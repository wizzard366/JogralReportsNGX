import { Routes, RouterModule }  from '@angular/router';
import { PreciosComponent } from './precios.component';

const routes: Routes = [
  {
    path: '',
    component: PreciosComponent
  }
];

export const routing = RouterModule.forChild(routes);