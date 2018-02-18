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
        let tmp_total=0;
        stock.forEach(element => {
          tmp_total+=Number(element.SaldoActual);
          element.SaldoActual=Number(element.SaldoActual).toLocaleString('en-US');
        });
        stock.push(
          {
            Bodega:"Total",
            SaldoActual:Number(tmp_total).toLocaleString('en-US')
          }
        )


        this.stock=stock;
        console.log('stock:',this.stock);
    }); 
  }

  isStockEmpty(){
    return typeof this.stock === 'undefined' || typeof this.stock[0] === 'undefined';
  }

  clear(){
    this.stock=[];
  }
  
}