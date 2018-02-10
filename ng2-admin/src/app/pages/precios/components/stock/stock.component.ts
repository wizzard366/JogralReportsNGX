import {Component} from '@angular/core';

import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'stock-table',
  templateUrl: './stock.component.html'
})
export class Stock {

  stock:Array<any>;


  
  constructor(private productSerive: ProductService) {
     
    
  }

  getStock($event){
    //console.log('get stock...')
    this.productSerive.getStock($event.productoId,$event.factor).subscribe(stock => {
        this.stock=stock;
        
    }); 
  }

  isStockEmpty(){
    return typeof this.stock === 'undefined' || typeof this.stock[0] === 'undefined';
  }

  clear(){
    this.stock=[];
  }
  
}