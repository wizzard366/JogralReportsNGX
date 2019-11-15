import { Component } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { LaboratoriesService } from '../../../services/laboratories.service';
import { DateService } from '../../../services/date.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import 'style-loader!../../../../theme/chartistJs.scss';
import { ChartistJsService } from '../../../charts/components/chartistJs/chartistJs.service';
import { chartistColorClasses } from '../../../../theme/chartist-color-classes';
import { LocalDataSource } from 'ng2-smart-table';
import {RenderLinkComponent} from "./render-link.component";

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';


import 'style-loader!./smartTable-custom.scss';
import { isString } from 'util';


@Component({
    selector: 'dash-laboratories',
    templateUrl: 'laboratories.html',
    providers: [ProductService, ChartistJsService, DateService],
    styleUrls: ['./laboratories.component.scss','../../../forms/components/inputs/components/selectInputs/selectInput.scss', '../../../../theme/sass/user-defined/media-querys.scss']
})
export class LaboratoriesComponent {

    public description: string;
    public selectedMarcaId: string;
    public showSelect = false;
    public showLoading = false;
    public showNotFoundAlert = false;
    public lab_sales_last_3yrs_show = false;
    public laboratories = [];
    public lab_sales_last_3yrs: any;
    public lab_sales_last_3yrs_options: any;
    public lab_sales_last_3yrs_table_data = [];
    public lab_sales_by_lab_and_product_source: any;
    public lab_sales_by_lab_and_product_data = [];
    private keys=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
    public date: any;
    public model;
    public model1;
    closeResult: string;
    private pid: any;
    private sub: any;

    constructor(private laboratoriesService: LaboratoriesService,
        private productService: ProductService,
        private _chartistJsService: ChartistJsService,
        private dateService: DateService,
        private modalService: NgbModal,
        private route: ActivatedRoute,
        private router: Router) {
        this.lab_sales_last_3yrs_options = this._chartistJsService.getAll()['simpleLineOptions'];
        this.lab_sales_by_lab_and_product_source = new LocalDataSource(this.lab_sales_by_lab_and_product_data);
        this.dateService.getServerDate().subscribe(date => {

            this.date = new Date(date.server_date);
            this.sub = this.route.params.subscribe(params => {
                this.pid = params['pid'];
                if (typeof this.pid !== 'undefined' && this.pid !== null) {

                    if (!isNaN(parseInt(this.pid))) {
                        this.selectClickOption({}, this.pid);
                    }

                }

            })

        });


    }
    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    public settings = {
        actions: {
            add: false,
            edit: false,
            delete: false
        },
        hideSubHeader: false,
        noDataMessage: 'No se encontraron datos',
        columns: {
            ProductoId: {
                title: 'PID',
                class: 'pid-class',
                filter: false
            },
            Descripcion: {
                title: 'Descripcion',
                type: 'custom',
                renderComponent: RenderLinkComponent,
                class: 'producto-class',
                filter: false
            }
        }
    }

    parseNumbers(cell, row) {

        return 'Q.' + cell.toLocaleString('en-US');
    }
    parseProductName(cell, row) {

        return "<a href='/#/pages/labs/productinfo/" + row.ProductoId + "'>" + cell + "</a>";

    }


    onSearch(query: string = '') {

        if(query === ''){
            query = ' ';
        }

        this.lab_sales_by_lab_and_product_source.setFilter([
            // fields we want to include in the search
            {
                field: 'Descripcion',
                search: query
            },
            {
                field: 'ProductoId',
                search: query
            }
        ], false);
    }

    selectKeyPress($event) {
        if ($event.charCode === 13) {
            let param = ('' + this.selectedMarcaId).trim();
            this.router.navigate(['/pages/labs/laboratories/' + param]);
            this.showSelect = false;
            this.showLoading = true;
            
            this.getLabById(this.selectedMarcaId);
            //this.getLabSalesPerProduct(this.selectedMarcaId);
            this.getProductsByMarca(this.selectedMarcaId)
        }
    }
    selectClick($event) {
        this.lab_sales_last_3yrs_show = false;
        let param = ('' + this.selectedMarcaId).trim();
        this.router.navigate(['/pages/labs/laboratories/' + param]);
        /* console.log('this was executed...');
        this.showSelect=false;
        this.showLoading=true;
        this.getLabById(this.selectedMarcaId);
        this.getLabSalesPerProduct(this.selectedMarcaId); */
    }

    selectClickOption($event, pid) {
        this.lab_sales_last_3yrs_show = false;
        this.selectedMarcaId = pid;
        let param = ('' + this.selectedMarcaId).trim();
        this.router.navigate(['/pages/labs/laboratories/' + param]);
        this.showSelect = false;
        this.showLoading = true;
        this.getLabById(this.selectedMarcaId);
        //this.getLabSalesPerProduct(this.selectedMarcaId);
        this.getProductsByMarca(this.selectedMarcaId)
    }

    getLabById(id) {
        id = new String(id);
        id = id.trim();
        let sinceYear = this.date.getFullYear() - 2;
        this.laboratoriesService.getLaboratorySales(id, sinceYear).subscribe(data => {

            this.showLoading = false;
            if (data === [] || typeof data[0] === 'undefined') {
                this.showNotFoundAlert = true;
            } else {
                this.setLabSalesData(data);
            }
        });
    }

    input(element) {
        if (this.description.length > 2) {

            this.showSelect = true;
            this.laboratoriesService.getLaboratoryByDescription(this.description).subscribe(data => {

                this.laboratories = data;
                //console.log("getLaboratoryByDescription:",data);
            });
        } else {
            this.showSelect = false;
            this.laboratories = [];
        }
    }

    getLabSalesPerProduct(id) {
        id = new String(id);
        id = id.trim();
        let sinceYear = this.date.getFullYear() - 2;

        this.showNotFoundAlert = false;
        this.laboratoriesService.getLaboratoryProductSales(id, sinceYear).subscribe(data => {

            if (data === [] || typeof data[0] === 'undefined') {
                this.showNotFoundAlert = true;
            } else {
                this.lab_sales_by_lab_and_product_data = data;
                this.lab_sales_by_lab_and_product_source.load(data);
            }
            this.showLoading = false;
        });
    }

    getProductsByMarca(id){
        id = new String(id);
        id = id.trim();

        this.showNotFoundAlert = false;
        this.productService.getProductsByMarca(id).subscribe(data => {

            if (data === [] || typeof data[0] === 'undefined') {
                this.showNotFoundAlert = true;
            } else {
                this.lab_sales_by_lab_and_product_source.load(data);
            }
            this.showLoading = false;
        });
    }

    setLabSalesData(data) {
        let tableData = [];
        let labels = [];
        let series = [];
        if (typeof data !== 'undefined' || data !== null) {
            data.forEach((element, index) => {
                let tempRow_tableData = [];
                let tempRow_series = [];
                tempRow_tableData['class'] = chartistColorClasses[index];
                Object.keys(element).forEach(key => {
                    if (key === 'Ano') {
                        tempRow_tableData['Year'] = element[key];
                    } else if (key === 'Total') {
                        tempRow_tableData['Total'] = element[key].toLocaleString('en-US');
                    } else if (key === 'Marca') {
                        if (index === 0) {
                            this.description = element[key];
                        }
                    } else if ((key !== 'MarcaId') && (key !== 'EmpresaId')) {
                        tempRow_tableData[key] = element[key].toLocaleString('en-US');
                        tempRow_tableData[key+'Raw'] = element[key];
                        tempRow_series.push(Number(element[key]) / 10000);
                        if (index === 0) {
                            labels.push(key.slice(0, 3));
                        }
                    }
                });
                tableData.push(tempRow_tableData);
                series.push(tempRow_series);
            });
        }
        this.lab_sales_last_3yrs = {
            series: series,
            labels: labels
        }
        this.lab_sales_last_3yrs_show = true;
        this.lab_sales_last_3yrs_table_data = this.setTableDataQuarterTotals(tableData);
        
    }


    setTableDataQuarterTotals(tabledata){
        tabledata.forEach(element => {
          let index=0;
          this.keys.forEach(monthKey=>{
            if(typeof element[monthKey] === 'undefined'){
              element[monthKey] = 0;
            }
          })
          element.firstQt = (this.checkfornullvalue(element.EneroRaw) + this.checkfornullvalue(element.FebreroRaw) + this.checkfornullvalue(element.MarzoRaw)).toLocaleString('en-US');
          if(element.firstQt === "NaN"){
            element.firstQt = 0;
          }
          element.secondQt = (this.checkfornullvalue(element.AbrilRaw) + this.checkfornullvalue(element.MayoRaw) + this.checkfornullvalue(element.JunioRaw)).toLocaleString('en-US');
          if(element.secondQt === "NaN"){
            element.secondQt = 0;
          }
          element.thirdQt = (this.checkfornullvalue(element.JulioRaw) + this.checkfornullvalue(element.AgostoRaw) + this.checkfornullvalue(element.SeptiembreRaw)).toLocaleString('en-US');
          if(element.thirdQt === "NaN"){
            element.thirdQt = 0;
          }
          element.fourthQt = (this.checkfornullvalue(element.OctubreRaw) + this.checkfornullvalue(element.NoviembreRaw) + this.checkfornullvalue(element.DiciembreRaw)).toLocaleString('en-US');
          if(element.fourthQt === "NaN"){
            element.fourthQt = 0;
          }
        });
        return tabledata;
      }
      checkfornullvalue(element){
        if (isNaN(element)){
          return 0;
        }
        return element;
      }

    
    
}
