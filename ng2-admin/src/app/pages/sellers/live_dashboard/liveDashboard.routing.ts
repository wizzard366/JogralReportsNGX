import { Routes, RouterModule }  from '@angular/router';
import { LiveDashboardComponent } from './liveDashboard.component';

const routes: Routes = [
  {
    path: '',
    component: LiveDashboardComponent
  }
];

export const routing = RouterModule.forChild(routes);