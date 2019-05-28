import {Component} from '@angular/core';
import { AfterViewInit, ViewChild } from '@angular/core';
import {ProductService} from '../services/product.service'
import { ActivatedRoute } from '@angular/router';
import { PsearchComponent } from './components/psearchForm';

@Component({
  selector: 'precios-search',
  templateUrl: 'precios.html',
  providers:[ProductService],
  
})
export class PreciosComponent implements AfterViewInit{
  

  public pid:any;

  @ViewChild(PsearchComponent)
  private searchComponent: PsearchComponent;

  constructor(private route: ActivatedRoute) {
    
  }

  ngAfterViewInit() {
    this.route.params.subscribe(params=>{
      this.pid = params['pid'];
      
      if(typeof this.pid !== 'undefined'){
        this.searchComponent.selectClickOption(null,this.pid)
      }
    })
  }
}