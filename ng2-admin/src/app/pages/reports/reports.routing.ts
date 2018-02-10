import { Routes, RouterModule }  from '@angular/router';
import { ReportsComponent } from './reports.component';

const routes: Routes = [
  {
    path: '',
    component: ReportsComponent
  }
];

export const routing = RouterModule.forChild(routes);