import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import {LabsComponent} from './labs.component';

import { LaboratoriesComponent } from './components/laboratories/laboratories.component';
import { routing }       from './labs.routing';
import {ProductInfoComponent} from  './components/produtInfo/productInfo.component';






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
    LabsComponent,
    LaboratoriesComponent,
    ProductInfoComponent,
  ],
  
})
export class LabsModule {}