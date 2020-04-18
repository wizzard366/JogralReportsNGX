import { Component, OnInit, Output, ViewChild,HostListener  } from '@angular/core';
import { ProductService } from '../services/product.service';
import { DateService } from '../services/date.service';



@Component({
    selector: 'simple-prices',
    templateUrl: './simple.prices.component.html',
    providers: [ProductService, DateService],
    styleUrls: ['./simple.prices.component.scss']
})
export class SimplePricesComponent {

    productoId: any;
    description: string;
    selectedUMedidaObj: any={};
    productSuggestionList=[];
    showSelect:boolean=false;
    selectedProductId:any;
    umedidaList:any = [];
    pricesList:any=[];
    rangesList:any=[];
    stockList:any=[];

    selectedProduct:any={};

    constructor(private productSerive: ProductService,
        private dateService: DateService) {


    }

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        
        let selectedIndex = jQuery('#selectedProductId').prop('selectedIndex');
        let totalOptions = jQuery("#selectedProductId option").length;
        if(event.key === 'ArrowUp'){
            if(totalOptions>1){
                jQuery('#selectedProductId').prop('selectedIndex', selectedIndex - 1).change()
                this.productoId = jQuery('#selectedProductId option:selected').attr('ng-reflect-value');
            }
        }else if(event.key == 'ArrowDown'){
            if(selectedIndex<totalOptions){
                jQuery('#selectedProductId').prop('selectedIndex', selectedIndex + 1).change()
                this.productoId = jQuery('#selectedProductId option:selected').attr('ng-reflect-value');
            }
            
        }else if(event.key == 'Enter'){
            if(this.productoId){
                this.description = jQuery('#selectedProductId option:selected').text();
            }
            this.showSelect = false;
            this.getProductbyID();
        }
    }

    getProductbyID() {
        this.productSerive.getProduct(this.productoId).subscribe(data=>{

            if(data.length > 0){
                this.description = `${data[0].descripcion} - ${data[0].productoId}`;
                this.selectedProduct.productoId = data[0].productoId;
                this.selectedProduct.descripcion = data[0].descripcion.trim();
                this.selectedProduct.area = data[0].area.trim();
                this.selectedProduct.subArea = data[0].subArea.trim();
                this.selectedProduct.costo = data[0].costo.toLocaleString('en-us');
                this.selectedProduct.afectoIva = data[0].afectoIva;
                this.selectedProduct.marca = data[0].marca.trim();

                this.productSerive.getUnitMeasurements(this.productoId).subscribe(data => {
                    this.umedidaList = data;
                    this.selectedUMedidaObj = data[0];
                    jQuery('#selectedUmedida').focus();
                    this.getUMedidaData();
                })
            }

        })
    }

    selectClick(){
        this.productoId = jQuery('#selectedProductId option:selected').attr('ng-reflect-value');
        this.showSelect = false;
        this.getProductbyID();
    }

    getUMedidaData(){
        this.productSerive.getStock(this.selectedProduct.productoId,this.selectedUMedidaObj.Factor).subscribe(data=>{
            this.stockList = data;
        })

        this.productSerive.getPrices(this.selectedProduct.productoId,this.selectedUMedidaObj.UMedidaId,this.selectedUMedidaObj.Descripcion).subscribe(data=>{
            this.pricesList = data;
        })
        this.productSerive.getPriceRanges(this.selectedProduct.productoId,this.selectedUMedidaObj.UMedidaId,this.selectedUMedidaObj.Descripcion,-1).subscribe(data=>{
            this.rangesList = data;
        })
    }

    umedidaChanged(){
        this.getUMedidaData();
    }

    getUmedidaObjFromCurrentList(){
        let medidaObj=null;
        this.umedidaList.forEach(medida=>{
            if(medida.Descripcion === this.selectedUMedidaObj.Descripcion){
                medidaObj =  medida;
            }
        })
        return medidaObj;
    }

    input($event){
        if(this.description.length > 2){
          this.productSerive.getProductByDescription(this.description).subscribe(data=>{
            this.productSuggestionList=data;
            this.showSelect=true;
          });
        }else{
          this.productSuggestionList=[];
          this.showSelect=false;
        }
    }

}