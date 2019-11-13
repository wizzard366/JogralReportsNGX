import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {LabsComponent} from './labs.component';

import { LaboratoriesComponent } from './components/laboratories/laboratories.component';
import { routing }       from './labs.routing';
import {ProductInfoComponent} from  './components/produtInfo/productInfo.component';
import {SellersSharedModule} from '../productSalesInfo/product.sales.info.sharedModule';
import {RenderLinkComponent} from './components/laboratories/render-link.component';
import {PreciosSharedModule} from '../precios/precios.shared.module';



@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgaModule,
    routing,
    Ng2SmartTableModule,
    NgbModule,
    SellersSharedModule,
    PreciosSharedModule
  ],
  declarations: [
    LabsComponent,
    LaboratoriesComponent,
    ProductInfoComponent,
    RenderLinkComponent
  ],
  entryComponents: [
    RenderLinkComponent
  ]
 
  
})
export class LabsModule {}