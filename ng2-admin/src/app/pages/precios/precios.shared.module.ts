import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule as AngularFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';

import {SalesGraphComponent} from './components/salesGraph/sales-graph.component';
import { SalesGraphService } from './components/salesGraph/sales-graph.service';



@NgModule({
    imports: [
        CommonModule,
        AngularFormsModule,
        NgaModule
        ],
    declarations: [
        SalesGraphComponent
    ],
    exports:[
        SalesGraphComponent
    ],
    providers:[
        SalesGraphService
    ]
})
export class PreciosSharedModule {}