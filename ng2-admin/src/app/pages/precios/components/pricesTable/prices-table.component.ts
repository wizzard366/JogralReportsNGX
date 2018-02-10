import {Component} from '@angular/core';


import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'prices-table',
  templateUrl: './prices-table.component.html'
})
export class PricesTable {

  prices:Array<any>;
  ranges:Array<any>;
  constructor(private productSerive: ProductService) {
     
    
  }

  getPrices($event){
    this.ranges=[];
    this.productSerive.getPrices($event.productoId,$event.uMediaId,$event.uMedidaDesc).subscribe(prices => {
        this.prices = prices;
       // console.log('table component:',this.prices);
    }); 
  }

  getRanges($event,TipoPrecioId,ProductoId,EmpresaId,UMedidaId,DescUMedida){
    $event.preventDefault();
    this.productSerive.getPriceRanges(ProductoId,UMedidaId,DescUMedida,TipoPrecioId).subscribe(ranges => {
        this.ranges = ranges;
        //console.log('table  ranges:',this.ranges);
    }); 
  }

  isPricesEmpty(){
    return typeof this.prices === 'undefined' || typeof this.prices[0] === 'undefined';
  }

  isRangesEmpty(){
    return typeof this.ranges === 'undefined' || typeof this.ranges[0] === 'undefined';
  }

  clear(){
    this.prices=[];
    this.ranges=[];
  }

}