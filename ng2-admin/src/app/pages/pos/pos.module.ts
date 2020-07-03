import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { routing } from './pos.routing';
import { FormsModule as AngularFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { PosComponent } from './pos.component';
import { PedGruposComponent } from '../pedgrupos/pedgrupos.component';
import { PedidosService } from '../services/pedidos.service';



@NgModule({
  imports: [
    CommonModule,
    routing,
    AngularFormsModule,
    NgaModule
  ],
  declarations: [
      PosComponent,
      PedGruposComponent
  ],
  providers:[ PedidosService ]
})
export class PosModule {}