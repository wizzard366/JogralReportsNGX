import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { routing } from './sales.routing';
import { FormsModule as AngularFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { SalesComponent } from './sales.component';





@NgModule({
  imports: [
    CommonModule,
    routing,
    AngularFormsModule,
    NgaModule,
    NgbModule
  ],
  declarations: [
    SalesComponent,
  ],
  providers:[
    
  ]
})
export class SalesModule {}