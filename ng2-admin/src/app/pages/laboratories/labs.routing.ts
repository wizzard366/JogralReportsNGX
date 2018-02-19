import { Routes, RouterModule }  from '@angular/router';
import { LaboratoriesComponent } from './components/laboratories/laboratories.component';
import { LabsComponent } from './labs.component';
import {ProductInfoComponent} from './components/produtInfo/productInfo.component';

const routes: Routes = [
  {
    path: '',
    component: LabsComponent,
    
    children:[
      {path: '',redirectTo:'laboratories'},
      {path:'productinfo/:pid',component:ProductInfoComponent},
      {path:'laboratories',component:LaboratoriesComponent}
    ]
  }
];

export const routing = RouterModule.forChild(routes);