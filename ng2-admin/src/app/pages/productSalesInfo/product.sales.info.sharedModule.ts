import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { NgaModule } from '../../theme/nga.module';
import { FormsModule } from '@angular/forms';

import {ProductSalesInfoComponent} from './product.sales.info.component';


@NgModule({
  imports: [
    CommonModule,
    NgaModule,
    FormsModule
  ],
  declarations: [
    ProductSalesInfoComponent
  ],
  exports:[
    ProductSalesInfoComponent
  ],
  providers:[
    
    
  ]
})
export class SellersSharedModule {}