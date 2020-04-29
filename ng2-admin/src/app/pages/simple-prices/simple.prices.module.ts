import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { routing } from './simple.prices.routing';
import { FormsModule as AngularFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { SimplePricesComponent } from './simple.prices.component';





@NgModule({
  imports: [
    CommonModule,
    routing,
    AngularFormsModule,
    NgaModule,
    NgbModule
  ],
  declarations: [
    SimplePricesComponent,
  ],
  providers:[
    
  ]
})
export class SimplePricesModule {}