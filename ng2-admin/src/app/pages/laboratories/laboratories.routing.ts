import { Routes, RouterModule }  from '@angular/router';
import { LaboratoriesComponent } from './laboratories.component';

const routes: Routes = [
  {
    path: '',
    component: LaboratoriesComponent
  }
];

export const routing = RouterModule.forChild(routes);