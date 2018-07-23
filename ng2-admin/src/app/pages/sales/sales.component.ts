import { Component } from '@angular/core';
import { ProductService } from '../services/product.service';
import { DateService } from '../services/date.service';

import 'style-loader!../../theme/chartistJs.scss';

import { ChartistJsService } from '../charts/components/chartistJs/chartistJs.service';


@Component({
  selector: 'sales-component',
  templateUrl: 'sales.component.html',
  providers: [ProductService, DateService, ChartistJsService],
  styleUrls: ['../../theme/sass/user-defined/media-querys.scss']
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

  constructor(private productSerive: ProductService,
    private dateService: DateService,
    private _chartistJsService: ChartistJsService) {

    this.showSelect = false;
    this.productSuggestionList = [];

    this.productSerive.getSellers().subscribe(data => {
      console.log("sellers", data);
      this.sellers_list = data;
    })

  }
  public simplepie = {
    simplePieData: {
      series: [5, 3, 4]
    },
    simplePieOptions: {
      fullWidth: true,
      height: '300px',
      weight: '300px',
      labelInterpolationFnc: function (value) {
        return value
      }
    }
  }



  public options = {
    labelInterpolationFnc: function (value) {
      return ((value * 100) / this.total_sales) + '%';
    }
  };

  public responsiveOptions = [
    ['screen and (min-width: 640px)', {
      chartPadding: 30,
      labelOffset: 100,
      labelDirection: 'explode',
      labelInterpolationFnc: function (value) {
        return value;
      }
    }],
    ['screen and (min-width: 1024px)', {
      labelOffset: 80,
      chartPadding: 20
    }]
  ];

  selectClick() {
    this.showSelect = false;
  }

  input() {

    if (this.product_description.length > 2) {
      this.showSelect = true;
      console.log(this.product_description);
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
    
    console.log(sales_by_seller)
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

      
      sales_by_seller.forEach(element => {
        series.push(element['cant']);
        console.log(element['cant'])
      });


      this.table_data = sales_by_seller;
      this.graph_data = {
        series:series
      }
      this.total_sales = total_sales;
      



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