import { Routes, RouterModule }  from '@angular/router';
import { CreditsComponent } from './credits.component';

const routes: Routes = [
  {
    path: '',
    component: CreditsComponent
  }
];

export const routing = RouterModule.forChild(routes);