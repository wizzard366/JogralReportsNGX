import { Component, Input, OnInit } from '@angular/core';
import { PurchasesService } from '../services/purchases.service'
import { LocalDataSource } from 'ng2-smart-table';
import { ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'show-cell',
  template: '<i class="{{iconClass}}" title="{{renderValue}}" aria-hidden="true"></i>',
  styleUrls:[
      './boolshow.cell.component.scss'
  ]
})

export class BoolShowComponent implements ViewCell, OnInit {
    renderValue: any;
    classToShow: string;
    iconClass:string;

    @Input() value: any;
    @Input() rowData: any;

    ngOnInit() {

        if(this.value){
            this.iconClass = 'fa fa-check check-yes'
        }else{
            this.iconClass = 'fa fa-times check-no'
        }
    }
}