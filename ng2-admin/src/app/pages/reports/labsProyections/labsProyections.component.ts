import {Component, Input} from '@angular/core';
import {AfterViewChecked} from '@angular/core';

import {DateService} from '../../services/date.service';

import 'easy-pie-chart/dist/jquery.easypiechart.js';
import 'style-loader!../pieCharts/pieCharts.scss';

import {ProductService} from '../../services/product.service';
import {SalesMan} from '../salesman';
import { LaboratoriesService } from 'app/pages/services/laboratories.service';

@Component({
  selector: 'labs-proyections',
  templateUrl: './labsProyections.component.html',
  providers:[DateService]
})
// TODO: move easypiechart to component
export class LabsProyectionsComponent implements AfterViewChecked{

  public charts: any = {};
  public chartArray:any=new Array();
  private _init = false;
  private current_sum:any=0;
  private proyection_sum:any=0;
  public total_percentage:any;
  public total_percentage_locale:any;
  public show_monthSelector:boolean=false;
  private raw_data:any;
  public selectedMonth:any;
  public selectedYear:any;
  public years:any=new Array();
  private total_proyection_locale:any;
  

  @Input() mode: string; 
  @Input() monthSelector:string;
  keys=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  key:any='Total';
  public date:any=new Date;
  constructor(private labsService: LaboratoriesService,private dateSerive:DateService) {

    this.dateSerive.getServerDate().subscribe(date=>{
      this.date=new Date(date.server_date);
      this.selectedMonth=this.date.getMonth();
      this.selectedYear=this.date.getFullYear();
      this.years=[this.selectedYear,this.selectedYear-1,this.selectedYear-2];
      if(this.monthSelector=='true'){
        this.show_monthSelector=true;
      }
      if(this.mode=='monthly'){    
        if(this.show_monthSelector){
          this.key=this.keys[this.date.getMonth()];
        }
      }
      this.labsService.getSalesAndProyectionsByLaboratory(this.selectedYear).subscribe(data=>{
        this.raw_data=data;
        
        this.parselabsdata(data);
      })
      
    })
  }
  isCurrentMonth(month){
    
    if(month===this.date.getMonth()){
      //this.selectedMonth=month;
      return true
    }
    return false;
  }
  public selectMonth(element){ 
    this.key=this.keys[element];
    this.parselabsdata(this.raw_data);  
  }

  public selectYear(element){
    this.total_percentage=0 
    this.total_percentage_locale = 0;
    this.selectedYear=element;
    this.labsService.getSalesAndProyectionsByLaboratory(this.selectedYear).subscribe(data=>{
      this.raw_data=data;
      this.parselabsdata(data);
    })
  }

  parselabsdata(data:any){
    this.current_sum=0;
    this.proyection_sum=0;
    this.total_percentage=0;
    
    this.chartArray=[];
    this.charts={};
    data.forEach(element => {
        this.addElement(element);
    });
    
    for(let item in this.charts){
        let check_percentage = (this.charts[item].Ventas/this.charts[item].Proyeccion)*100;
        if(!isNaN(check_percentage)){
          this.charts[item].percentageOfProyection=check_percentage;
        }else{
          this.charts[item].percentageOfProyection=0;
        }
        
        this.charts[item].localizedSales = this.charts[item].Ventas.toLocaleString('en-US');
        this.charts[item].localizedProyection = this.charts[item].Proyeccion.toLocaleString('en-US');
        this.chartArray.push(this.charts[item]);
        this.current_sum=this.current_sum + this.charts[item].Ventas;
        this.proyection_sum=this.proyection_sum + this.charts[item].Proyeccion;
    }
    this.total_percentage=(this.current_sum/this.proyection_sum)*100; 
    this.total_percentage_locale = this.current_sum.toLocaleString('en-US');
    this.total_proyection_locale = this.proyection_sum.toLocaleString('en-US');

    this._loadPieCharts();
    
  }

  addElement(element:any){
    let id =Number.parseInt(element.MarcaId)
    if (typeof this.charts[id] === 'undefined'){
        this.charts[id]={};
    }
    this.charts[id][element.Fuente]=element[this.key];
    this.charts[id]['Description']=element.Descripcion;
    this.charts[id]['Ano']=element.Ano;
  }

  ngAfterViewChecked() {
    if (!this._init) {
      this._loadPieCharts();
      //this._updatePieCharts();
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
