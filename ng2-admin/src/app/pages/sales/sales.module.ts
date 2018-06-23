import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { routing } from './sales.routing';
import { FormsModule as AngularFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';

import { SalesComponent } from './sales.component';





@NgModule({
  imports: [
    CommonModule,
    routing,
    AngularFormsModule,
    NgaModule,
  ],
  declarations: [
    SalesComponent,
  ],
  providers:[
    
  ]
})
export class SalesModule {}