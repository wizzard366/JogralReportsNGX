import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { ChartistJsService } from '../../../charts/components/chartistJs/chartistJs.service';

@Component({
  selector: 'product-info',
  templateUrl: './productInfo.component.html',
  providers: [ProductService, ChartistJsService]
})
export class ProductInfoComponent  {

    id:any;
    private sub:any;
    private show_money:any;
    private graph_data_money:any;
    private graph_data_quantity:any;
    private labels:any;
    private graph_options:any;
    private product_name: any;
    private product_id: any;
    private product_marca:any;
    private show_quantites:any;
    


    constructor(private route: ActivatedRoute, private productService: ProductService, private chartistJsService:ChartistJsService) {
        this.show_money=false;   
        this.show_quantites=false;
        
        this.labels=[];
        this.graph_options= this.chartistJsService.getAll()['simpleLineOptions'];

        this.sub=this.route.params.subscribe(params=>{
            this.id=params['pid'];

            this.productService.getProduct(this.id).subscribe(data=>{

                

                if(typeof data[0] !== 'undefined' && data[0]!== null){
                    this.product_id = data[0].productoId;
                    this.product_marca= data[0].marca;
                    this.product_name = data[0].descripcion;
                }
            })

            this.productService.getSalesByProduct(this.id).subscribe(data=>{
                
                let graph_data_money=[];
                let graph_data_quantity=[];
                this.labels=[];
                data.forEach(element => {
                    
                    if(typeof element !== 'undefined' && element !== null){
                        this.labels.push(element.Fecha);
                        graph_data_money.push(element.Monto);
                        graph_data_quantity.push(element.Cantidad);
                    }
    
                });
                this.graph_data_money={
                    labels:this.labels,
                    series:[graph_data_money]
                }
                this.graph_data_quantity={
                    labels:this.labels,
                    series:[graph_data_quantity]
                }
                console.log("money:",this.graph_data_money);
                console.log("quantity:",this.graph_data_quantity);
            });

        })

        
    }



    ngOnInit(){

        


    }
    ngOnDestroy(){
        this.sub.unsubscribe();
    }



}
