import {Component, Input, Output} from '@angular/core';
import {AfterViewChecked, EventEmitter} from '@angular/core';



import {PieChartsService} from './pieCharts.service';

import 'easy-pie-chart/dist/jquery.easypiechart.js';
import 'style-loader!./pieCharts.scss';

import {ProductService} from '../../services/product.service';
import {SalesMan} from '../salesman';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';

import {DateService} from '../../services/date.service';
//import { PieChartService } from '../../dashboard/pieChart/pieChart.service';

@Component({
  selector: 'pie-charts',
  templateUrl: './pieCharts.html',
  providers: [ProductService,DateService,PieChartsService]
})
// TODO: move easypiechart to component
export class PieCharts implements AfterViewInit{

  public charts: any;
  private _init = false;

  @Input() mode: string; 
  @Input() show: boolean;
  @Output() onYearSelected = new EventEmitter();

  private selectedYear:any;
  private selectedMonth:any;

  private date= new Date;
  private raw_data:any;
  public availableYears:any;
  private insideloop:any;
  private show_monthSelector:boolean = true;
  keys=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  key:any;
  constructor(private productSerive: ProductService, private dateService: DateService,
    private piechartService:PieChartsService) {

    this.dateService.getServerDate().subscribe(date=>{

      this.date = new Date(Number(date.server_date));
      this.selectedMonth = this.date.getMonth();
      this.selectedYear = this.date.getFullYear();
      
      this.insideloop=false;
      this.availableYears=[this.date.getFullYear(),this.date.getFullYear()-1];

      this.productSerive.getSalesBySalesManProyectionsByYear(this.date.getFullYear()).subscribe(data=>{
        
        this.raw_data=data;
        this.processChartData(data,this.date.getMonth());
      
      });
    })
  }
  wait=true;
  ready=false;

  ngAfterViewInit() {
    
    this._loadPieCharts(3000);
    //this._updatePieCharts();
    
    if(this.mode=="live"){
      this.show_monthSelector=false;
    }
    
    
  }

  

  isCurrentMonth(month){
    if(month===this.date.getMonth()){
      //this.selectedMonth=month;
      return true
    }
    return false;
  }
  isCurrentYear(year){
    if(year===this.date.getFullYear()){
      //this.selectedYear=year;
      return true
    }
    return false;
  }


  private showLiveReadings(){
    this.insideloop=true;
    this.productSerive.getSalesBySalesManProyectionsByYear(this.date.getFullYear()).subscribe(data=>{
      
      
      this.raw_data=data;
      this.processChartData(data,this.date.getMonth());
      this._loadPieCharts(1000);
      
      setTimeout(() => {
        this.showLiveReadings();
      }, 30000);
      
    });

  }

  private processChartData(data,month){
    
    let salesMans={};
    
    let temSalesMan:SalesMan;
    if(this.mode=='mensual'){
        this.key=this.keys[this.date.getMonth()];
    }else if(this.mode=='live' && !this.insideloop){
      this.showLiveReadings();
    }else{
      this.key='Total';
    }
    if(month !== false){
      this.key=this.keys[month];
    }

    data.forEach(element => {
        
        if( typeof salesMans === 'undefined' || typeof salesMans[element.VendedorId] ===  'undefined' || salesMans[element.VendedorId]===null){

          if(element.Fuente==='Ventas'){
            let temp = new SalesMan;
            temp.setId(element.VendedorId);
            temp.setName(element.Nombre);
            //temp.setCurrent(element.Total);
            temp.setCurrent(element[this.key]);
            salesMans[element.VendedorId]=temp;
            
          }else if(element.Fuente==='Proyeccion'){
            let temp = new SalesMan;
            temp.setId(element.VendedorId);
            temp.setName(element.Nombre);
            //temp.setProyection(element.Total);
            temp.setProyection(element[this.key]);
            salesMans[element.VendedorId]=temp;
            
          }
        }else{
          if(element.Fuente==='Ventas'){
            salesMans[element.VendedorId].setCurrent(element[this.key]);
            if(typeof salesMans[element.VendedorId].proyection !== 'undefined'){
              salesMans[element.VendedorId].setPercentageOfProyection();
            }
          }else if(element.Fuente==='Proyeccion'){
            salesMans[element.VendedorId].setProyection(element[this.key]);
            if(typeof salesMans[element.VendedorId].current !== 'undefined'){
              salesMans[element.VendedorId].setPercentageOfProyection();
            }
          }
        }
      });
      let arr = [];
      let keys = Object.keys(salesMans);
      keys.forEach(key=>{
        let slmnTmp=salesMans[key];
        if(!(typeof slmnTmp.current === 'undefined' || slmnTmp.current === null) && !(typeof slmnTmp.proyection === 'undefined' || slmnTmp.proyection === null)){
          arr.push(slmnTmp);
        }
           
      });
      this.charts = arr;
      this.ready=true;

  }

  public selectMonth(element){
    this.selectedMonth=element;
    this.processChartData(this.raw_data,element);
    this._loadPieCharts(1000);
  }

  public selectYear(element){
    
    this.onYearSelected.emit(this.selectedYear);
    this.selectedYear=element;
    this.piechartService.setReferenceYear(this.selectedYear);
    this.productSerive.getSalesBySalesManProyectionsByYear(element).subscribe(data=>{
        
      this.raw_data=data;
      
      this.processChartData(data,this.selectedMonth);
      this._loadPieCharts(2000);
    });
  }

  private _loadPieCharts(milisecs) {
    
      setTimeout(() => {
           
        jQuery('.chart').each(function () {
          let chart = jQuery(this);
          
          chart.easyPieChart({
            easing: 'easeOutBounce',
            onStep: function (from, to, percent) {
              jQuery(this.el).find('.percent').text(Math.round(percent));
            },
            barColor: function (percent){
              if(percent<=10){
                return "#e85656"
              }else if(percent>10 && percent<=30){
                return "#dfb81c"
              }else if(percent>=90){
                return "#90b900"
              }else{
                return "#209e91"
              }
              
            },
            trackColor: 'rgba(0,0,0,0)',
            size: 84,
            scaleLength: 0,
            animation: 2000,
            lineWidth: 9,
            lineCap: 'round',
          });
        });
      }, milisecs);
  }

}
