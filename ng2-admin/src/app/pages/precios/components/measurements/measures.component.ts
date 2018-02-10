import {Component,  Output, EventEmitter} from '@angular/core';


import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'measures-table',
  templateUrl: './measures.component.html'
})
export class MeasuresComponent {
    @Output() selectUMedida = new EventEmitter();
    @Output() renderStock = new EventEmitter();
  measures:Array<any>;
 
  constructor(private productSerive: ProductService) {
     
    
  }

  getMeasures($event){
    this.measures=$event;
  }

  showPrices(index){
    this.selectUMedida.emit(index);
    this.renderStock.emit(index);
  }

  isMeasuresEmpty(){
    return typeof this.measures === 'undefined' || typeof this.measures[0] === 'undefined';
  }

  clear(){
    this.measures=[];
  }

}