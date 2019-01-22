import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { routing } from './reports.routing';
import { FormsModule as AngularFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';

import { ReportsComponent } from './reports.component';

import { PieCharts } from './pieCharts';
import { PieChartsService } from './pieCharts/pieCharts.service';
import {LabsProyectionsComponent} from './labsProyections'



@NgModule({
  imports: [
    CommonModule,
    routing,
    AngularFormsModule,
    NgaModule,
  ],
  declarations: [
    ReportsComponent,
    PieCharts,
    LabsProyectionsComponent
  ],
  providers:[
    PieChartsService
  ]
})
export class ReportsModule {}