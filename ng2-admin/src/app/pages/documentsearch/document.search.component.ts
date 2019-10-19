import { Component } from '@angular/core';
import { DocumentsService } from '../services/documents.service';
import { ProductService } from '../services/product.service';
import { DateService } from '../services/date.service';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';


@Component({
    selector: 'document-search-component',
    templateUrl: 'document.search.component.html',
    providers: [DocumentsService,ProductService,DateService],
    styleUrls: ['./document.search.component.scss','../../theme/sass/user-defined/media-querys.scss']
})
export class DocumentSearchComponent {
    public product_id: any;
    product_description: any = [];
    areaSuggestionList: any;
    showSelect: any;
    showSelectArea: any;
    productSuggestionList: any;
    subAreaSuggestionList: any = [];
    subarea_id:any;
    public startDate: any;
    public endDate: any;
    area_description: any = [];
    area_id:any;
    marcaSuggestionList:any = [];
    marca_id:any;
    marca_description:any;
    showSelectMarca:any;

    constructor(private documentsService: DocumentsService, private productSerive: ProductService,
        private dateService: DateService, ) {
        //this.documentsService.getdocuments(null, 1158, null, null, null, null, null).subscribe(data => { console.log(data) })
        this.showSelect = false;
        this.showSelectArea = false;
        this.showSelectMarca = false;
        this.productSuggestionList = [];
    }

    selectClick() {
        this.showSelect = false;
    }
    selectClickArea(){
        this.showSelectArea = false;
    }
    

    input() {
        if (this.product_description.length > 2) {
            this.showSelect = true;
            this.productSerive.getProductByDescription(this.product_description).subscribe(data => {
                this.productSuggestionList = data;
            });
        } else {
            this.showSelect = false;
            this.productSuggestionList = [];
        }
    }

    inputArea() {
        if (this.area_description.length > 1) {
            this.showSelectArea = true;
            this.productSerive.getAreaByDescription(this.area_description).subscribe(data => {
                this.areaSuggestionList = data;
            });
        } else {
            this.showSelectArea = false;
            this.areaSuggestionList = [];
        }
    }
    areaBlur(){
        if (this.area_description.length<1){
            this.subAreaSuggestionList = [];
            this.subarea_id=null;
        }
    }

    selectClickOptionArea($event,areaid){
        console.log('subarea selected')
        this.area_id = areaid;
        this.getSubAreaOptions(this.area_id);
    }

    getSubAreaOptions(areaid){
        this.productSerive.getSubAreaById(areaid).subscribe(data=>{
            console.log('data obteind',data)
            this.subAreaSuggestionList = data;
        })
    }

    selectClickOptionSubArea($event,subareaid){
        this.subarea_id = subareaid;
    }

    isSubAreaListFull(){
        return this.subAreaSuggestionList.length > 0;
    }

    inputMarca(){
        if (this.marca_description.length > 1) {
            this.showSelectMarca = true;
            this.productSerive.getMarcaByDescription(this.marca_description).subscribe(data => {
                this.marcaSuggestionList = data;
            });
        } else {
            this.showSelectMarca = false;
            this.marcaSuggestionList = [];
        }
    }

    selectClickMarca(){
        this.showSelectMarca = false;
    }

    selectClickOptionMarca($event,marcaid){
        this.marca_id = marcaid;
    }
}