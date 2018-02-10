import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { NgaModule } from '../../theme/nga.module';
import { FormsModule } from '@angular/forms';

import { PieCharts } from './pieCharts';
import { PieChartsService } from './pieCharts/pieCharts.service';


@NgModule({
  imports: [
    CommonModule,
    NgaModule,
    FormsModule
  ],
  declarations: [
    PieCharts
  ],
  exports:[
    PieCharts
  ],
  providers:[
    PieChartsService,
    
  ]
})
export class SellersSharedModule {}