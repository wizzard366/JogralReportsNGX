  
import { Component, Input, OnInit } from '@angular/core';

import { ViewCell } from 'ng2-smart-table';
import { SalesGraphService } from 'app/pages/precios/components/salesGraph/sales-graph.service';
import { SellInSellOutService } from 'app/pages/precios/components/sellInSellOut/sell-in-sell-out.service';

@Component({
    selector: 'render-link',
    template: '<a href="javascript:void(0);" (click)="renderGraph()">{{renderValue}}</a>',
    
})
export class RenderLinkComponent implements ViewCell, OnInit{

    renderValue: string;

    @Input() value: string | number;
    @Input() rowData: any;

    constructor(private salesGraphService:SalesGraphService,private sellInSellOutService:SellInSellOutService){

    }

    renderGraph(){
        this.salesGraphService.renderGraph(this.rowData.ProductoId);
        this.sellInSellOutService.renderGraph(this.rowData.MarcaId,this.rowData.ProductoId);
    }
  
    ngOnInit() {
      this.renderValue = this.value.toString().toUpperCase();
    }

}