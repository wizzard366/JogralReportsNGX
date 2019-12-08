import { Injectable, Output, EventEmitter } from '@angular/core'

@Injectable()
export class SalesGraphService {


  @Output() change: EventEmitter<boolean> = new EventEmitter();

  renderGraph(productid) {
    this.change.emit(productid);
  }

}