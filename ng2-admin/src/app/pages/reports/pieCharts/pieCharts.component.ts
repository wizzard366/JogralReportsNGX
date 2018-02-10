import {Component, Input} from '@angular/core';
import {AfterViewChecked} from '@angular/core';

import {PieChartsService} from './pieCharts.service';
import {DateService} from '../../services/date.service';

import 'easy-pie-chart/dist/jquery.easypiechart.js';
import 'style-loader!./pieCharts.scss';

import {ProductService} from '../../services/product.service';
import {SalesMan} from '../salesman';

@Component({
  selector: 'pie-charts',
  templateUrl: './pieCharts.html',
  providers:[DateService]
})
// TODO: move easypiechart to component
export class PieCharts implements AfterViewChecked{

  public charts: any;
  private _init = false;
  @Input() mode: string; 
  @Input() mode2: string;
  keys=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  key:any;
  date:any;
  constructor(private productSerive: ProductService,private dateSerive:DateService) {

    this.dateSerive.getServerDate().subscribe(date=>{

      this.date=new Date(date.server_date);
      this.productSerive.getSalesBySalesManProyectionsByYear(this.date.getFullYear()).subscribe(data=>{
      
        this.processChartData(data);
      });
    })

    
    
  }

  processChartData(data){
    let salesMans={};
      let date= new Date;
      let temSalesMan:SalesMan;

      if(this.mode=='mensual'){
        this.key=this.keys[date.getMonth()];
      }else{
        this.key='Total';
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

  wait=true;
  ready=false;
  ngAfterViewChecked() {
    if (!this._init) {
      this._loadPieCharts();
      //this._updatePieCharts();
      this._init = true;
    }

    
  }

  private _loadPieCharts() {
    
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
      }, 2000);
  }

  private _updatePieCharts() {
    let getRandomArbitrary = (min, max) => { return Math.random() * (max - min) + min; };

    jQuery('.pie-charts .chart').each(function(index, chart) {
      jQuery(chart).data('easyPieChart').update(getRandomArbitrary(55, 90));
    });
  }
}
