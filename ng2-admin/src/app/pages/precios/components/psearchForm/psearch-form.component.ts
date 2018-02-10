import { Component,  Output, EventEmitter} from '@angular/core';
import { Product } from './objects/product';
import { ProductService } from '../../../services/product.service';
import { UMeasueres } from './objects/umeasures';



@Component({
  selector: 'product-search-forms',
  templateUrl: './psearch-form.component.html',
  styleUrls: ['../../../forms/components/inputs/components/selectInputs/selectInput.scss', '../../../../theme/sass/user-defined/media-querys.scss']
})
export class PsearchComponent {
  @Output() initRenderPrices = new EventEmitter();
  @Output() initRenderStock = new EventEmitter();
  @Output() initRenderMeasures = new EventEmitter();
  @Output() clearAll = new EventEmitter();

  productoId: string;
  descripcion: string;
  selectedUMedida: number;
  productIVA:string;
  productArea:string;
  productSubArea:string;
  productMarca:string;

  product: Product;
  productSuggestionList=[];
  selectedProductId:string;
  uMedidas: UMeasueres[];

  showTable: boolean;
  showNotFoundAlert: boolean;
  showSelect:boolean;

  

  constructor(private productSerive: ProductService) {
    //this.descripcion = 'Ingrese una descripcion';
    this.showTable=false;
    this.showNotFoundAlert=false;
    this.showSelect=false;
    this.productSuggestionList=[
    1,2,3
  ];
  }

  

  // gets a product description and umedida from the product code entered on the "codigo" form input.
  getProductbyID(event) {
    event.preventDefault();
    this.productSerive.getProduct(this.productoId).subscribe(product => {
      if (typeof product[0] !== 'undefined' && product[0] !== null) {
        this.descripcion = product[0].descripcion;
        this.productoId = product[0].productoId;
        this.productIVA=product[0].afectoIva;
        this.productArea=product[0].area;
        this.productSubArea=product[0].subArea;
        this.productMarca=product[0].marca;
        this.showTable=true;
        this.showNotFoundAlert=false;
        this.productSerive.getUnitMeasurements(this.productoId).subscribe(umedidas => {
          if (typeof umedidas[0] !== 'undefined' && umedidas[0] !== null) {
            this.uMedidas = umedidas;         
            this._initRenderPrices(this._initRenderStock(0));
            this._initRenderMeasures(this.uMedidas);
          }else{
            umedidas=[];
          }
        });
      }else{
        this.productoId=null;
        this.descripcion = null;
        this.productoId = null;
        this.productIVA=null;
        this.productArea=null;
        this.productSubArea=null;
        this.productMarca=null;
        this.uMedidas=[];
        this.showTable=false;
        this.showNotFoundAlert=true;
        this.clearAll.emit();
      }
    });
  }

  _initRenderMeasures(params){
    this.initRenderMeasures.emit(params);
  }

  _initRenderPrices(callback){
    let params = {
      productoId:this.productoId,
      uMediaId:this.uMedidas[0].UMedidaId,
      uMedidaDesc: this.uMedidas[0].Descripcion,
      productIVA: this.productIVA
    }
    this.initRenderPrices.emit(params);
    callback;
  }
  
  _initRenderStock(i){
    let params={
      productoId:this.productoId,
      factor:this.uMedidas[i].Factor,
    }
    this.initRenderStock.emit(params);
  }

  
  

  getProductbyDescription(event) {
    event.preventDefault();
    
    
  }

  selectUMedida(selectedValue){
    let params = {
      productoId:this.productoId,
      uMediaId:this.uMedidas[selectedValue].UMedidaId,
      uMedidaDesc: this.uMedidas[selectedValue].Descripcion,
      productIVA: this.productIVA
    }

    this.initRenderPrices.emit(params);

    let stockParams = {
      productoId:this.productoId,
      factor:this.uMedidas[selectedValue].Factor
    }
    //this.initRenderStock.emit(params);
  }

  selectKeyPress($event){
    if($event.charCode===13){
      this.showSelect=false;
      this.getProductbyID($event);
    }

  }

  selectClick($event){
    this.showSelect=false;
    this.getProductbyID($event);
  }

  selectClickOption($event,pid){
    this.productoId=pid;
    this.selectClick($event);
  }

  descriptionInputKeyPress($event,el){
    
      if($event.charCode===40){
        
        el.focus(); 
      }
  }

  input(element){
    
    if(this.descripcion.length > 2){
      this.showSelect=true;
      this.productSerive.getProductByDescription(this.descripcion).subscribe(data=>{
        this.productSuggestionList=data;
        //element.change();
      });
    }else{
      this.showSelect=false;
      this.productSuggestionList=[];
    }
    
  }

}


