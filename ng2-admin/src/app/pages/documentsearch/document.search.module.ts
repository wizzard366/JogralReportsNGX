import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { routing } from './document.search.routing';
import { FormsModule as AngularFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {DocumentSearchComponent} from './document.search.component';

@NgModule({
    imports: [
      CommonModule,
      routing,
      AngularFormsModule,
      NgaModule,
      NgbModule
    ],
    declarations: [
        DocumentSearchComponent,
    ],
    providers:[
      
    ]
  })
  export class DocumentSearchModule {}