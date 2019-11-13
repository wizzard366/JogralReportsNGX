  
import { Component, Input, OnInit } from '@angular/core';

import { ViewCell } from 'ng2-smart-table';
import { SalesGraphService } from 'app/pages/precios/components/salesGraph/sales-graph.service';

@Component({
    selector: 'render-link',
    template: '<a href="javascript:void(0);" (click)="renderGraph(renderValue)">{{renderValue}}</a>',
    
})
export class RenderLinkComponent implements ViewCell, OnInit{

    renderValue: string;

    @Input() value: string | number;
    @Input() rowData: any;

    constructor(private salesGraphService:SalesGraphService){

    }

    renderGraph(){
        console.log([this.renderValue,this.value,this.rowData]);
        this.salesGraphService.renderGraph(this.rowData.ProductoId);
    }
  
    ngOnInit() {
      this.renderValue = this.value.toString().toUpperCase();
    }

}