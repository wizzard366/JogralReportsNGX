import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { NgaModule } from '../../theme/nga.module';
import { FormsModule } from '@angular/forms';

import {ProductSalesInfoComponent} from './product.sales.info.component';
import {LabsProyectionsComponent} from '../reports/labsProyections'


@NgModule({
  imports: [
    CommonModule,
    NgaModule,
    FormsModule
  ],
  declarations: [
    ProductSalesInfoComponent,
    LabsProyectionsComponent
  ],
  exports:[
    ProductSalesInfoComponent,
    LabsProyectionsComponent
  ],
  providers:[
    
    
  ]
})
export class SellersSharedModule {}