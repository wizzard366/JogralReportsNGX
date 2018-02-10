import {Component} from '@angular/core';
import {ProductService} from '../services/product.service'


@Component({
  selector: 'precios-search',
  templateUrl: 'precios.html',
  providers:[ProductService],
  
})
export class PreciosComponent {
  constructor() {}
}