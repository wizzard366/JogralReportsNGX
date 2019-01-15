import { Component, Input, OnInit } from '@angular/core';
import { PurchasesService } from '../services/purchases.service'
import { LocalDataSource } from 'ng2-smart-table';
import { ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'display-description',
  template: '<div class="description" >{{pdescription}}</div>',
  styleUrls:['./mov.component.scss']
})

export class DisplayDescriptionComponent implements ViewCell, OnInit {
    
    pdescription: any;

    @Input() value: any;
    @Input() rowData: any;

    ngOnInit() {
        this.pdescription = this.value
        console.log(this.value)
    }



}