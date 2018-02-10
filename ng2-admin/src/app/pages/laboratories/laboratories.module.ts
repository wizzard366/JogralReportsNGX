import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { LaboratoriesComponent } from './laboratories.component';
import { routing }       from './laboratories.routing';




@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgaModule,
    routing,
    Ng2SmartTableModule,
    
  ],
  declarations: [
    LaboratoriesComponent
  ]
})
export class LaboratoriesModule {}