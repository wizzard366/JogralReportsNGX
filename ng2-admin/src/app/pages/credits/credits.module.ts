import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { routing } from './credits.routing';
import { FormsModule as AngularFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { CreditsComponent } from './credits.component';





@NgModule({
  imports: [
    CommonModule,
    routing,
    AngularFormsModule,
    NgaModule,
    NgbModule
  ],
  declarations: [
    CreditsComponent,
  ],
  providers:[
    
  ]
})
export class CreditsModule {}