import { Injectable, Output, EventEmitter } from '@angular/core'

@Injectable()
export class SellInSellOutService {


  @Output() change: EventEmitter<any> = new EventEmitter();
  @Output() changeMarca: EventEmitter<any> = new EventEmitter();

  renderGraph(marcaid,productid) {
    console.log('emit change')
    this.change.emit([marcaid,productid]);
  }

  rendermarca(marcaid){
    console.log('emit changemarca')
    this.changeMarca.emit(marcaid);
  }

}
