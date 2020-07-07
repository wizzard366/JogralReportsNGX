import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { routing } from './pos.routing';
import { FormsModule as AngularFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { PosComponent } from './pos.component';
import { PedGruposComponent } from '../pedgrupos/pedgrupos.component';
import { PedidosService } from '../services/pedidos.service';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { BoolShowComponent } from '../pedgrupos/boolshow.cell.component';
import { GrupoNumberComponent } from '../pedgrupos/gruponumber.cell.component';



@NgModule({
  imports: [
    CommonModule,
    routing,
    AngularFormsModule,
    NgaModule,
    Ng2SmartTableModule
  ],
  entryComponents:[
    BoolShowComponent,
    GrupoNumberComponent
  ],
  declarations: [
      PosComponent,
      PedGruposComponent,
      BoolShowComponent,
      GrupoNumberComponent
  ],
  providers:[ PedidosService ]
})
export class PosModule {}