import { Component } from '@angular/core';
import { DocumentsService } from '../services/documents.service';
import { ProductService } from '../services/product.service';
import { DateService } from '../services/date.service';
import { Observable } from 'rxjs';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';


@Component({
    selector: 'document-search-component',
    templateUrl: 'document.search.component.html',
    providers: [DocumentsService, ProductService, DateService],
    styleUrls: ['./document.search.component.scss', '../../theme/sass/user-defined/media-querys.scss']
})
export class DocumentSearchComponent {
    public product_id: any;
    product_description: any = [];
    areaSuggestionList: any;
    showSelect: any;
    showSelectArea: any;
    productSuggestionList: any;
    subAreaSuggestionList: any = [];
    subarea_id: any;
    public startDate: any;
    public endDate: any;
    area_description: any = [];
    area_id: any;
    marcaSuggestionList: any = [];
    marca_id: any;
    marca_description: any;
    showSelectMarca: any;
    showSelectCliente: any;
    cliente_name: any;
    clienteSuggestionList: any = [];
    cliente_id: any;
    departamento_description: any;
    showSelectDepto: any;
    deptoSuggestionList: any = [];
    departamento_id: any;
    municipio_description: any;
    showSelectMuni: any;
    muniSuggestionList: any = [];
    municipio_id: any;
    vendedor_name: any;
    showSelectVendedor: any;
    vendedorSuggestionList: any = [];
    vendedor_id: any;
    smartTabledata: LocalDataSource;
    documents: any;
    checked:boolean=false;
    public settings = {
        actions: {
            add: false,
            edit: false,
            delete: false
        },
        hideSubHeader: true,
        noDataMessage: 'No se encontraron datos',
        columns: {
            NumeroDoc: {
                title: 'NumeroDoc',
                class: 'ano-class',
                type: 'text',
                filter: false
            },
            Nombre: {
                title: 'Nombre',
                type: 'text',
                class: 'producto-class',
                filter: false
            },
            NIT: {
                title: 'NIT',
                class: 'pid-class',
                type: 'text',
                filter: false

            },
            Fecha: {
                title: 'Fecha',
                filter: false,
                type: 'text'

            },
            Total: {
                title: 'Total',
                filter: false,
                valuePrepareFunction: this.parseNumbers
            }
        }


    }



    constructor(private documentsService: DocumentsService, private productSerive: ProductService,
        private dateService: DateService, ) {
        this.showSelect = false;
        this.showSelectArea = false;
        this.showSelectMarca = false;
        this.productSuggestionList = [];
        this.smartTabledata = new LocalDataSource(this.documents);
    }

    parseNumbers(cell, row) {
        return 'Q.' + cell.toLocaleString('en-US');
    }

    

    selectClick() {
        this.showSelect = false;
    }
    selectClickArea() {
        this.showSelectArea = false;
    }

    selectClickVendedor() {
        this.showSelectVendedor = false;
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

    inputCliente() {

        if (this.cliente_name.length > 1) {
            this.showSelectCliente = true;
            this.productSerive.getClienteByNameOrId(this.cliente_name).subscribe(data => {
                this.clienteSuggestionList = data;
            });
        } else {
            this.showSelectCliente = false;
            this.clienteSuggestionList = [];
        }
    }

    inputDepto() {
        if (this.departamento_description.length > 1) {
            this.showSelectDepto = true;
            this.productSerive.getDeptoByDescription(this.departamento_description).subscribe(data => {
                this.deptoSuggestionList = data;
            });
        } else {
            this.showSelectDepto = false;
            this.deptoSuggestionList = [];
        }
    }

    inputMuni() {
        if (this.municipio_description.length > 1) {
            this.showSelectMuni = true;
            this.productSerive.getMuniByDescription(this.municipio_description).subscribe(data => {
                this.muniSuggestionList = data;
            });
        } else {
            this.showSelectMuni = false;
            this.muniSuggestionList = [];
        }
    }

    inputVendedor() {
        if (this.vendedor_name.length > 1) {
            this.showSelectVendedor = true;
            this.productSerive.getVendedorByDescription(this.vendedor_name).subscribe(data => {
                this.vendedorSuggestionList = data;
            });
        } else {
            this.showSelectVendedor = false;
            this.vendedorSuggestionList = [];
        }
    }

    areaBlur() {
        if (this.area_description.length < 1) {
            this.subAreaSuggestionList = [];
            this.subarea_id = null;
        }
    }

    selectClickOptionArea($event, areaid) {
        this.area_id = areaid;
        this.getSubAreaOptions(this.area_id);
    }

    getSubAreaOptions(areaid) {
        this.subarea_id = null;
        this.productSerive.getSubAreaById(areaid).subscribe(data => {
            this.subAreaSuggestionList = data;
        })
    }

    selectClickOptionSubArea($event, subareaid) {
        console.log('subarea:', subareaid)
        this.subarea_id = subareaid;
    }

    selectClickOptionCliente($event, clienteid) {
        this.cliente_id = clienteid
    }

    selectClickOptionDepto($event, deptoid) {
        this.departamento_id = deptoid;
    }

    selectClickOptionMuni($event, muniid) {
        this.municipio_id = muniid;
    }

    selectClickOptionVendedor($event, vendedorid) {
        this.vendedor_id = vendedorid;
    }

    isSubAreaListFull() {
        return this.subAreaSuggestionList.length > 0;
    }



    inputMarca() {
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

    selectClickMarca() {
        this.showSelectMarca = false;
    }

    selectClickOptionMarca($event, marcaid) {
        this.marca_id = marcaid;
    }

    selectClickCliente() {
        this.showSelectCliente = false;
    }

    selectClickDepto() {
        this.showSelectDepto = false;
    }

    selectClickMuni() {
        this.showSelectMuni = false;
    }

    isempty(fieldToCheck){
        return this.checked && !fieldToCheck
    }   

    searchForDocuments() {
        if (this.startDate && this.endDate) {
            let startDate = this.startDate;
            let endDate = this.endDate;
            let start = '' + startDate.year.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + '-'
                + startDate.month.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + '-'
                + startDate.day.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });

            let end = '' + endDate.year.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + '-'
                + endDate.month.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + '-'
                + endDate.day.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });

            this.documentsService.getdocuments(this.cliente_id, this.product_id, this.area_id, this.subarea_id, this.vendedor_id, this.departamento_id, this.municipio_id, start, end).subscribe(data => {
                this.smartTabledata.load(data);
                this.documents = data;
            })
        } else {
            this.checked = true;
        }



    }
}