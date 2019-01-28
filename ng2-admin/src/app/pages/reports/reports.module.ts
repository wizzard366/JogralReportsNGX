import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { routing } from './reports.routing';
import { FormsModule as AngularFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';

import { ReportsComponent } from './reports.component';

import { PieCharts } from './pieCharts';
import { PieChartsService } from './pieCharts/pieCharts.service';
import {SellersSharedModule} from '../productSalesInfo/product.sales.info.sharedModule';



@NgModule({
  imports: [
    CommonModule,
    routing,
    AngularFormsModule,
    NgaModule,
    SellersSharedModule
  ],
  declarations: [
    ReportsComponent,
    PieCharts,
    
  ],
  providers:[
    PieChartsService
  ],
  exports:[
    
  ]
})
export class ReportsModule {}