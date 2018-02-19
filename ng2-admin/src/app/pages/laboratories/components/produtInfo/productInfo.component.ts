import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'product-info',
  templateUrl: './productInfo.component.html',
  
})
export class ProductInfoComponent  {

    id:any;
    private sub:any;

    constructor(private route: ActivatedRoute) {
        
    }

    ngOnInit(){
        this.sub=this.route.params.subscribe(params=>{
            this.id=params['pid'];
        })
    }
    ngOnDestroy(){
        this.sub.unsubscribe();
    }
}
