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

  @Input() mode: string; 
  @Input() mode2: string;
  keys=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  key:any;
  date:any;
  constructor(private labsService: LaboratoriesService,private dateSerive:DateService) {


    this.labsService.getSalesAndProyectionsByLaboratory().subscribe(data=>{
        this.parselabsdata(data);
    })
    
  }


  parselabsdata(data:any){
    
    data.forEach(element => {
        this.addElement(element);
        
    });

    for(let item in this.charts){
        this.charts[item].percentageOfProyection=(this.charts[item].Ventas/this.charts[item].Proyeccion)*100;
        this.charts[item].localizedSales = this.charts[item].Ventas.toLocaleString('en-US');
        this.charts[item].localizedProyection = this.charts[item].Proyeccion.toLocaleString('en-US');
        this.chartArray.push(this.charts[item]);
        this.current_sum=this.current_sum + this.charts[item].Ventas;
        this.proyection_sum=this.proyection_sum + this.charts[item].Proyeccion;
    }
    this.total_percentage=(this.current_sum/this.proyection_sum)*100; 
    this.total_percentage_locale = this.current_sum.toLocaleString('en-US');
  }

  addElement(element:any){
    let id =Number.parseInt(element.MarcaId)
    if (typeof this.charts[id] === 'undefined'){
        this.charts[id]={};
    }
    this.charts[id][element.Fuente]=element.Total;
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
            trackColor: '#e6ffff',
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
