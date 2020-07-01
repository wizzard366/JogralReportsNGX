import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { routing } from './sales.lab.routing';
import { FormsModule as AngularFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { SalesLabComponent } from './sales.lab.component';





@NgModule({
  imports: [
    CommonModule,
    routing,
    AngularFormsModule,
    NgaModule,
    NgbModule
  ],
  declarations: [
    SalesLabComponent,
  ],
  providers:[
    
  ]
})
export class SalesLabModule {}