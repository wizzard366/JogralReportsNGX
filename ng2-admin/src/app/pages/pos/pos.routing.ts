import { Routes, RouterModule }  from '@angular/router';
import { PosComponent } from './pos.component';
import { PedGruposComponent } from '../pedgrupos/pedgrupos.component';

import { AuthGuard } from '../services/oauth/auth.guard.component';
import { AuthGuarPED } from '../services/oauth/auth.guard.ped.component';

const routes: Routes = [
  {
    path: '',
    component: PosComponent,
    
    children:[
      {path: '',redirectTo:'grupos'},
      {path:'grupos',component:PedGruposComponent,canActivate: [AuthGuarPED]}
    ]
  }
];

export const routing = RouterModule.forChild(routes);