import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { routing } from './clients.routing';
import { FormsModule as AngularFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';

import { ClientsComponent } from './clients.component';




@NgModule({
  imports: [
    CommonModule,
    routing,
    AngularFormsModule,
    NgaModule,
  ],
  declarations: [
    ClientsComponent,
  ]
})
export class ClientsModule {}