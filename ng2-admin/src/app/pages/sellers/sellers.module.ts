import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { routing } from './sellers.routing';
import { FormsModule as AngularFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';


import { SellersComponent } from './sellers.component';
//import { PieCharts } from './pieCharts';
import { PieChartsService } from './pieCharts/pieCharts.service';

import {SellersSharedModule} from './sellers.sharedModule';

@NgModule({
  imports: [
    CommonModule,
    routing,
    AngularFormsModule,
    NgaModule,
    SellersSharedModule
  ],
  declarations: [
    SellersComponent,
    //PieCharts
    
  ],
  providers:[
   // PieChartsService
  ]
})
export class SellersModule {}