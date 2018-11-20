import { Component, Input, OnInit } from '@angular/core';
import { PurchasesService } from '../services/purchases.service'
import { LocalDataSource } from 'ng2-smart-table';
import { ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'mov-cell',
  template: '<i class="{{iconClass}}" title="{{renderValue}}"></i>',
  styleUrls:['./mov.component.scss']
})

export class MovComponent implements ViewCell, OnInit {
    renderValue: number;
    iconClass: string;

    @Input() value: any;
    @Input() rowData: any;

    ngOnInit() {
        this.renderValue = Number.parseFloat(this.value.cell);

        if(this.renderValue > 0){
            this.iconClass = 'ion-arrow-up-c up'
        }else if(this.renderValue < 0){
            this.iconClass = 'ion-arrow-down-c down'
        }else{
            this.iconClass = 'ion-close-round'
        }
        
    }



}