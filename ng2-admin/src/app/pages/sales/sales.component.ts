import { Component } from '@angular/core';
import { ProductService } from '../services/product.service';
import { DateService } from '../services/date.service';

@Component({
    selector: 'sales-component',
    templateUrl: 'sales.component.html',
    providers: [ProductService,DateService],
  })
  export class SalesComponent {
    constructor(private productSerive: ProductService, 
        private dateService: DateService) {
        
        
        }

  }