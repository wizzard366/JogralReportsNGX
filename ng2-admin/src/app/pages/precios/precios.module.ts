import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { routing } from './precios.routing';
import { FormsModule as AngularFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';


import { PreciosComponent } from './precios.component';
import { PsearchComponent } from './components/psearchForm/psearch-form.component';
import { PricesTable } from './components/pricesTable/prices-table.component';
import { Stock } from './components/stock/stock.component';
import { MeasuresComponent } from './components/measurements/measures.component';
import { SalesGraphComponent } from './components/salesGraph/sales-graph.component';
import {PreciosSharedModule} from './precios.shared.module';



@NgModule({
  imports: [
    CommonModule,
    routing,
    AngularFormsModule,
    NgaModule,
    PreciosSharedModule
  ],
  declarations: [
    PreciosComponent,
    PsearchComponent,
    PricesTable,
    Stock,
    MeasuresComponent
  ]
})
export class PreciosModule {}