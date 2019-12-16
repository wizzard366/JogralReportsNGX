import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule as AngularFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';

import {SalesGraphComponent} from './components/salesGraph/sales-graph.component';
import { SalesGraphService } from './components/salesGraph/sales-graph.service';

import {SellInSellOutComponent} from './components/sellInSellOut/sell-in-sell-out.component';
import {SellInSellOutService} from './components/sellInSellOut/sell-in-sell-out.service';



@NgModule({
    imports: [
        CommonModule,
        AngularFormsModule,
        NgaModule
        ],
    declarations: [
        SalesGraphComponent,
        SellInSellOutComponent
    ],
    exports:[
        SalesGraphComponent,
        SellInSellOutComponent
    ],
    providers:[
        SalesGraphService,
        SellInSellOutService
    ]
})
export class PreciosSharedModule {}