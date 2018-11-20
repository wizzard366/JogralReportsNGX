import { Component, Input, OnInit } from '@angular/core';
import { PurchasesService } from '../services/purchases.service'
import { LocalDataSource } from 'ng2-smart-table';
import { ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'show-cell',
  template: '<div class="{{classToShow}}">{{renderValue}}</div>',
  styleUrls:[
      './show.cel.component.scss'
  ]
})

export class ShowCellComponent implements ViewCell, OnInit {
    renderValue: string;
    classToShow: string;

    @Input() value: any;
    @Input() rowData: any;

    ngOnInit() {
        this.renderValue = this.value.cell;

        if(this.value.cell === 'SEGUIMINETO'){
            this.classToShow = 'follow'
        }else if(this.value.cell === 'EXCEDE'){
            this.classToShow = 'exceeds'
        }else if(this.value.cell==='URGENTE'){
            this.classToShow = 'urgent'
        }else if(this.value.cell==='IDEAL'){
            this.classToShow = 'ideal'
        }else{
            this.classToShow = 'default'
        }
        
        
    }



}