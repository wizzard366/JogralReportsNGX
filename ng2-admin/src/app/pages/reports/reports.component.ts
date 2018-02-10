import { Component } from '@angular/core';
import { ProductService } from '../services/product.service';
import { DateService } from '../services/date.service';

import 'easy-pie-chart/dist/jquery.easypiechart.js';
import 'style-loader!../../theme/chartistJs.scss';
import 'style-loader!../dashboard/pieChart/pieChart.scss';
import { ChartistJsService } from '../charts/components/chartistJs/chartistJs.service';
import { chartistColorClasses } from '../../theme/chartist-color-classes';
import { SalesMan } from './salesman';

@Component({
  selector: 'dash-reports',
  templateUrl: 'reports.component.html',
  providers: [ProductService, ChartistJsService,DateService],
})
export class ReportsComponent {
  year = 2016;
  date:any;
  years = [];
  private _init = false;
  _data: any;
  _sales_by_brand_data: any;
  _sales_by_sales_man_data: any;
  SalesPerYearData: any;
  SalesPerYearOptions: any;
  SalesByBrandData: any;
  SalesByBrandOptions: any;
  SalesBySalesManData: any;
  SalesBySalesManOptions: any;
  SalesBySalesManResponsive: any;
  pieResponsiveOptions: any;
  SalesByBrandTableData: any;
  SalesBySalesManAndProyectionsData: any;
  
  pieChartConf:any;



  constructor(private productSerive: ProductService, private _chartistJsService: ChartistJsService, 
    private dateService: DateService) {

    
    this.dateService.getServerDate().subscribe(serverDate=>{
      this.date = new Date(serverDate.server_date);
      this.year = this.date.getFullYear() - 2;
      this.productSerive.getSalesPerYear(this.year).subscribe(data => {
        this._data = data;
        console.log("data:",data);
        this.SalesPerYearData = {
          labels: [],
          series: []
        }
        this.getSalesPerYear();
      });


    });

    this.pieChartConf='mensual';
    this.SalesPerYearOptions = this._chartistJsService.getAll()['simpleLineOptions'];

    
    this._sales_by_brand_data = [];
    this.productSerive.getSalesByBrand().subscribe(data => {
      this._sales_by_brand_data = data;
      this.getSalesByBrand();
    });
    this._sales_by_sales_man_data = [];
    this.productSerive.getSalesBySalesMan().subscribe(data => {
      this._sales_by_sales_man_data = data;
      this.getSalesBySalesMan();
    });
    this.pieResponsiveOptions = [
      ['screen and (min-width: 640px)', {
        chartPadding: 100,
        labelOffset: 10,
        labelDirection: 'explode',

      }],
      ['screen and (min-width: 1024px)', {
        labelOffset: 80,
        chartPadding: 20
      }]
    ];

    /* this.productSerive.getSalesBySalesManProyectionsAll().subscribe(data=>{
      this.SalesBySalesManAndProyectionsData = this.getSalesBySalesManWithProyections(data);
    }); */
  }

  getResponsive(padding, offset) {
    return this._chartistJsService.getResponsive(padding, offset);
  }

  getSalesPerYear() {

    let labels: any;
    let series = [];
    labels = [];
    let colorClass = "ct-series-";

    if (typeof this._data !== 'undefined' || this._data !== null) {
      let labls = Object.keys(this._data[0]);
      labls.forEach(label => {
        labels.push(label.slice(0, 3));
      })
      let tempIndex = 0;
      let temp = [];
      this._data.forEach(element => {
        element["class"] = chartistColorClasses[tempIndex];
        let sumMonths=0;
        labls.forEach(label => {
          if (label !== 'Year') {
            if (element[label] === null) {
              temp.push(0.00);
              this._data[tempIndex][label]="0.00";
            } else {
              temp.push(Number(element[label]) / 10000);
              sumMonths+=Number(this._data[tempIndex][label]);
              this._data[tempIndex][label]=this._data[tempIndex][label].toLocaleString('en-US')
            }
          }
        });
        
        this._data[tempIndex]["Total"]=sumMonths.toLocaleString('en-US');
        sumMonths=0;
        series.push(temp);
        temp = [];
        tempIndex++;
      });

      var SalesPerYearData = {
        labels: labels.slice(1, 13),
        series: series
      }
      this.SalesPerYearData = SalesPerYearData;
      console.log("_data:",this._data);
    }
  }

  getSalesByBrand() {
    this.SalesByBrandOptions = this._chartistJsService.getAll()['labelsPieOptions'];

    let labels = [];
    let info = [];
    this._sales_by_brand_data.forEach((obj, i) => {
      labels.push({
        label: obj['Marca'],
        class: chartistColorClasses[i],
        number: obj['Total'].toLocaleString('en-US')
      });
      info.push(obj['Total']);
    });
    this.SalesByBrandTableData = labels;
    this.SalesByBrandData = {
      //labels:labels,
      series: info
    }
    this.SalesByBrandOptions.labelInterpolationFnc = function (value) {
      return Math.round(value / info.reduce(sum) * 100) + '%';
    }
    var sum = function (a, b) { return a + b };


  }

  getSalesBySalesMan() {

    this.SalesBySalesManResponsive = this._chartistJsService.getAll()['multiBarResponsive'];
    this.SalesBySalesManOptions = {
      fullWidth: true,
      height: '300px',
      axisX: {

        labelInterpolationFnc: function (value) {
          return value.slice(0, 3);
        }
      }
    }

    let labels = [];
    let info = [];
    this._sales_by_sales_man_data.forEach((obj,i) => {
      labels.push(obj['Vendedor']);
      info.push(obj['Total'] / 1000);
      obj['Total']=obj['Total'].toLocaleString('en-US');
    });

    this.SalesBySalesManData = {
      labels: labels,
      series: [info],

    }
  }

  getSalesBySalesManWithProyections(data){
    
    let salesMans={};

    let temSalesMan:SalesMan;

    data.forEach(element => {
      
      if( typeof salesMans === 'undefined' || typeof salesMans[element.VendedorId] ===  'undefined' || salesMans[element.VendedorId]===null){

        if(element.Fuente==='Ventas'){
          let temp = new SalesMan;
          temp.setId(element.VendedorId);
          temp.setName(element.Nombre);
          temp.setCurrent(element.Total);
          
          salesMans[element.VendedorId]=temp;
          
        }else if(element.Fuente==='Proyeccion'){
          let temp = new SalesMan;
          temp.setId(element.VendedorId);
          temp.setName(element.Nombre);
          temp.setProyection(element.Total);
          
          salesMans[element.VendedorId]=temp;
          
        }
      }else{
        if(element.Fuente==='Ventas'){
          salesMans[element.VendedorId].setCurrent(element.Total);
          if(typeof salesMans[element.VendedorId].proyection !== 'undefined'){
            salesMans[element.VendedorId].setPercentageOfProyection();
          }
        }else if(element.Fuente==='Proyeccion'){
          salesMans[element.VendedorId].setProyection(element.Total);
          if(typeof salesMans[element.VendedorId].current !== 'undefined'){
            salesMans[element.VendedorId].setPercentageOfProyection();
          }
        }
      }
    });
    let arr = [];
    let keys = Object.keys(salesMans);
    keys.forEach(key=>{
        arr.push(salesMans[key]); 
    })
    console.log( 'arr:',arr);
    return arr;

  } 

  ngAfterViewInit() {
    if (!this._init) {
      
      /* this._loadPieCharts();
      this._updatePieCharts(); */
      this._init = true;
    }
  }

  private _loadPieCharts() {
      console.log(jQuery('.chart'));
    jQuery('.chart').each(function () {
      let chart = jQuery(this);
      
      chart.easyPieChart({
        easing: 'easeOutBounce',
        
        barColor: 'rgba(100,100,0,0)',
        trackColor: 'rgba(0,0,0,0)',
        size: 84,
        scaleLength: 0,
        animation: 2000,
        lineWidth: 9,
        lineCap: 'round',
      });
    });
  }

  private _updatePieCharts() {
    

    jQuery('.pie-charts .chart').each(function(index, chart) {
      jQuery(chart).data('easyPieChart').update(80);
    });
  }


}