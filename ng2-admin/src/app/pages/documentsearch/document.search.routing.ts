import { Routes, RouterModule }  from '@angular/router';
import { DocumentSearchComponent } from './document.search.component';

const routes: Routes = [
  {
    path: '',
    component: DocumentSearchComponent
  }
];

export const routing = RouterModule.forChild(routes);