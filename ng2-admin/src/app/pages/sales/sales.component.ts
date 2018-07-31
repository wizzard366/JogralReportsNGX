import { Component } from '@angular/core';
import { ProductService } from '../services/product.service';
import { DateService } from '../services/date.service';
import { chartistColorClasses } from '../../theme/chartist-color-classes';
import 'style-loader!../../theme/chartistJs.scss';

import { ChartistJsService } from '../charts/components/chartistJs/chartistJs.service';


@Component({
  selector: 'sales-component',
  templateUrl: 'sales.component.html',
  providers: [ProductService, DateService, ChartistJsService],
  styleUrls: ['../../theme/sass/user-defined/media-querys.scss','./custom.scss']
})
export class SalesComponent {
  public product_id: any;
  product_description: any = [];
  product_marca: any;
  public vendedor_id: any;
  vendedor_name: any;
  showSelect: any;
  productSuggestionList: any;
  public sellers_list: any = [];
  public startDate: any;
  public endDate: any;
  public table_data: any = [];
  public graph_data: any;
  public total_sales: any = 0;
  public show:any=false;

  constructor(private productSerive: ProductService,
    private dateService: DateService,
    private _chartistJsService: ChartistJsService) {

    this.showSelect = false;
    this.productSuggestionList = [];

    this.productSerive.getSellers().subscribe(data => {
     
      this.sellers_list = data;
    })

  }
  public simplepie = {
    simplePieData: {
      series: [5, 3, 4],
      labels: ['1','2','3']
    },
    simplePieOptions: {
      fullWidth: true,
      height: '300px',
      weight: '300px',
      labelDirection: 'explode',
      labelInterpolationFnc: function (value) {
        return value
      }
    }
  }



  

  

  selectClick() {
    this.showSelect = false;
  }

  input() {

    if (this.product_description.length > 2) {
      this.showSelect = true;
      
      this.productSerive.getProductByDescription(this.product_description).subscribe(data => {

        this.productSuggestionList = data;
        //element.change();
      });
    } else {
      this.showSelect = false;
      this.productSuggestionList = [];
    }

  }

  updateGraph(pid, vid, startDate, endDate) {
    let start: any;
    let end: any;
    let test_vendedor_id = "000";
    let sales_by_seller: any = [];
    let tmp_sum = 0;
    let seller_qty = 0;

    let tmp_element = {};

    let sellers = [];
    let series = [];
    
    
    let total_sales = 0;
    start = '' + startDate.year.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + '-'
      + startDate.month.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + '-'
      + startDate.day.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });

    end = '' + endDate.year.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + '-'
      + endDate.month.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + '-'
      + endDate.day.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });

    this.productSerive.getSalesByProductIdAndVendedorIdByDateInterval(pid, start, end).subscribe(data => {



      data.forEach((element, index) => {
        element.Fecha = this.parseDate(element.Fecha, '/')

        if (test_vendedor_id !== element.VendedorId) {
          if (index > 0) {
            sales_by_seller.push(tmp_element);
            total_sales = total_sales + tmp_element['cant'];
          }
          test_vendedor_id = element.VendedorId;
          tmp_element = {
            vendedorId: element.VendedorId,
            nombre: element.NombreCompleto,
            desc: element.Descripcion,
            cant: element.Cantidad
          }
        } else {
          tmp_element['cant'] = tmp_element['cant'] + element.Cantidad
        }
      })
      
      sales_by_seller.sort((a,b)=>{
        return b['cant']-a['cant'];
      })
      let labels=[];

      sales_by_seller.forEach((element,index) => {
        series.push(element['cant']);
        element['class']=chartistColorClasses[index]
        element['percentage']=Math.round((element['cant']*100/total_sales))+"%";
        labels.push(element['percentage'])
      });
      
      

      //series.sort((a,b)=>{return a-b});
      

      this.table_data = sales_by_seller;
      this.graph_data = {
        labels:labels,
        series:series
        
      }
      
      this.total_sales = total_sales;
      this.show=true;



    })

  }

  parseDate(date: string, delimiter) {

    let newDate = new Date(date);
    let day = newDate.getDate();
    let month = newDate.getMonth();
    let year = newDate.getFullYear();


    return '' + day + delimiter + (month + 1) + delimiter + year;
  }

}