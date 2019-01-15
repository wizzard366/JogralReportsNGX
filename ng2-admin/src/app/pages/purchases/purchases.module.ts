import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { routing } from './purchases.routing';
import { FormsModule as AngularFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';

import { PurchasesComponent } from './purchases.component';

import { Ng2SmartTableModule } from 'ng2-smart-table';
import {ShowCellComponent} from './show.cel.component';
import {MovComponent} from './mov.component';
import {DisplayDescriptionComponent} from './displaydescription.component';

@NgModule({
  imports: [
    CommonModule,
    routing,
    AngularFormsModule,
    NgaModule,
    Ng2SmartTableModule,
    
  ],
  entryComponents:[
    ShowCellComponent,
    MovComponent,
    DisplayDescriptionComponent
  ],
  declarations: [
    PurchasesComponent,
    ShowCellComponent,
    MovComponent,
    DisplayDescriptionComponent
  ]
})
export class PurchasesModule {}