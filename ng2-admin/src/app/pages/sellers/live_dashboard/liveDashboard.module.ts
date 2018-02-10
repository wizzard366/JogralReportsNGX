import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { routing } from './liveDashboard.routing';
import { FormsModule as AngularFormsModule } from '@angular/forms';
import { NgaModule } from '../../../theme/nga.module';


import {LiveDashboardComponent} from './liveDashboard.component';

import {SellersSharedModule} from '../sellers.sharedModule';

@NgModule({
  imports: [
    CommonModule,
    routing,
    AngularFormsModule,
    NgaModule,
    SellersSharedModule,
    
  ],
  declarations: [LiveDashboardComponent  ],
  providers:[  ]
})
export class LiveDashboardModule {}