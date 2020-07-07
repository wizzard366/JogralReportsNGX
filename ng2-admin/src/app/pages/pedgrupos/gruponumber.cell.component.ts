import { Component, Input, OnInit } from '@angular/core';
import { PurchasesService } from '../services/purchases.service'
import { LocalDataSource } from 'ng2-smart-table';
import { ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'show-cell',
  template: '<div class="group-number-container"> \
                <a [routerLink]="linkTo" class="group-number">{{groupNumber}}</a> \
            </div>',
  styleUrls:[
      './groupnumber.cell.component.scss'
  ]
})

export class GrupoNumberComponent implements ViewCell, OnInit {

    linkTo:any;
    groupNumber:any;

    @Input() value: any;
    @Input() rowData: any;

    ngOnInit() {
        this.linkTo=`/pos/pedidos/${this.value}`;
        this.groupNumber = this.value;
    }
}