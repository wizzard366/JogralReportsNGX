import {Component, Input, Output} from '@angular/core';
import {ProductService} from '../../services/product.service';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';

import {DateService} from '../../services/date.service';

import{LaboratoriesService} from '../../services/laboratories.service';


@Component({
  selector: 'detail-piechart-seller',
  templateUrl: './detailPieChartsBySeller.component.html',
  styleUrls: ['./detailPieChartsBySeller.component.scss','../../../theme/sass/user-defined/media-querys.scss'],
  providers: [ProductService,DateService],
})
// TODO: move easypiechart to component
export class DetailPieChartsBySeller implements AfterViewInit{

  selectedMarcaId:any="-1";
  selectedMarcaDesc:any="Todos";
  selectedMonth=0;
  sellers = {};

  chartDataArray = [];
  chartOptionsArray = [];
  chartDisplayArray = [];

  description:any;
  showSelect:any=false;
  showLoading = false;
  laboratories:any=[];
  keys=["Total","Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];


  constructor(private labsoratoriesService: LaboratoriesService,
    private dateService: DateService){

      dateService.getServerDate().subscribe(data => {
        labsoratoriesService.getLabsbySeller().subscribe(data=>{
          data.forEach(element => {
            if(typeof this.sellers[element.VendedorId.trim()] !=='undefined'){
              this.updateSellerObject(this.sellers[element.VendedorId.trim()],element);
            }else{
              this.sellers[element.VendedorId.trim()] = this.createSellerObject(element);
            }
          })
          this.updateCharts();
        })
      })
  }

  simpleDonutOptions = {
      fullWidth: true,
      donut: true,
      showLabel: true,
      donutWidth: 25,
      height: '110px',
      width: '100%',
      total: 125,
    }
    
    testOptions=[
      this.simpleDonutOptions
    ]

  chartData =  {
      series: [55, 45],
      labels: ['Bayer', 'Otros']
    }
  ngAfterViewInit(): void {
      console.log("method");
  }

  

  createSellerObject(rootElement){
    var returnSellerObject = {
      NombreCompleto:rootElement.NombreCompleto,
      [rootElement.MarcaId.trim()]:{
        [rootElement.Fuente.trim()]:{
          Enero:rootElement.Enero,
          Febrero:rootElement.Febrero,
          Marzo:rootElement.Marzo,
          Abril:rootElement.Abril,
          Mayo:rootElement.Mayo,
          Junio:rootElement.Junio,
          Julio:rootElement.Julio,
          Agosto:rootElement.Agosto,
          Septiembre:rootElement.Septiembre,
          Octubre:rootElement.Octubre,
          Noviembre:rootElement.Noviembre,
          Diciembre:rootElement.Diciembre,
          Total:rootElement.Total,
          NombreCompleto:rootElement.NombreCompleto,
          Descripcion:rootElement.Descripcion,
          Ano:rootElement.Ano
        }
      }
    }
    return returnSellerObject;
  }

  updateSellerObject(seller,rootElement){
    //check if lab already exists.
    if(typeof seller[rootElement.MarcaId.trim()] !== 'undefined'){
      // check if type does not exists and creates new type object with month data.
      if(typeof seller[rootElement.MarcaId.trim()][rootElement.Fuente.trim()] == 'undefined'){
        seller[rootElement.MarcaId.trim()][rootElement.Fuente.trim()]={
          Enero:rootElement.Enero,
          Febrero:rootElement.Febrero,
          Marzo:rootElement.Marzo,
          Abril:rootElement.Abril,
          Mayo:rootElement.Mayo,
          Junio:rootElement.Junio,
          Julio:rootElement.Julio,
          Agosto:rootElement.Agosto,
          Septiembre:rootElement.Septiembre,
          Octubre:rootElement.Octubre,
          Noviembre:rootElement.Noviembre,
          Diciembre:rootElement.Diciembre,
          Total:rootElement.Total,
          NombreCompleto:rootElement.NombreCompleto,
          Descripcion:rootElement.Descripcion,
          Ano:rootElement.Ano
        }
      }
    }else{
      //if lab does not exists, create lab and type object with month data.
      seller[rootElement.MarcaId.trim()]={
        [rootElement.Fuente.trim()]:{
          Enero:rootElement.Enero,
          Febrero:rootElement.Febrero,
          Marzo:rootElement.Marzo,
          Abril:rootElement.Abril,
          Mayo:rootElement.Mayo,
          Junio:rootElement.Junio,
          Julio:rootElement.Julio,
          Agosto:rootElement.Agosto,
          Septiembre:rootElement.Septiembre,
          Octubre:rootElement.Octubre,
          Noviembre:rootElement.Noviembre,
          Diciembre:rootElement.Diciembre,
          Total:rootElement.Total,
          NombreCompleto:rootElement.NombreCompleto,
          Descripcion:rootElement.Descripcion,
          Ano:rootElement.Ano
        }
      }
    }
  }

  getOptions(rootElement){
    
    return {
      fullWidth: true,
      donut: true,
      showLabel: false,
      donutWidth: 10,
      height: '110px',
      width: '100%',
      total: 0
    }
  }


  getChartData(rootElement){
    let proyectionTotal = 0;
    let labTotal = 0;
    let allLabsTotal = 0;

    Object.keys(rootElement).forEach( key =>{

      if(typeof rootElement[key].Proyeccion !== 'undefined'){
        proyectionTotal = proyectionTotal + Number.parseFloat(rootElement[key].Proyeccion[this.keys[this.selectedMonth]]);
      }
      if(typeof rootElement[key].Ventas !== 'undefined'){
        if(key === this.selectedMarcaId.trim()){
          labTotal = labTotal + Number.parseFloat(rootElement[key].Ventas[this.keys[this.selectedMonth]]);
        }else{
          allLabsTotal = allLabsTotal + Number.parseFloat(rootElement[key].Ventas[this.keys[this.selectedMonth]]);
        }
      }
    })
    return {
      proyectionTotal,
      labTotal,
      allLabsTotal
    }
  }


  updateCharts(){

    console.log('selected:',[this.selectedMarcaDesc,this.selectedMarcaId])
    this.chartDataArray = [];
    this.chartOptionsArray = [];
    this.chartDisplayArray = [];

    Object.keys(this.sellers).forEach(key=>{

      var temp = this.getChartData(this.sellers[key]);
      var proyToShow =0;
      this.chartDataArray.push({
        series:[
          temp.allLabsTotal,
          temp.labTotal
        ],
        labels:[
          "Todos",
          "Lab"
        ]
      })

      var tempPercent =  (((temp.allLabsTotal+temp.labTotal)*100)/temp.proyectionTotal);
      console.log(this.sellers[key].NombreCompleto,tempPercent);
      if(tempPercent === Infinity){
        tempPercent = 100.00;
      }
      if(isNaN(tempPercent)){
        tempPercent = 0.00;
      }

      this.chartDisplayArray.push({
        total:(temp.allLabsTotal+temp.labTotal).toLocaleString('en-us'),
        lab:temp.labTotal.toLocaleString('en-us'),
        proyection: temp.proyectionTotal.toLocaleString('en-us'),
        percentage: tempPercent.toFixed(2),
        name:this.sellers[key].NombreCompleto,
        others:temp.allLabsTotal
      })

      if((temp.allLabsTotal + temp.labTotal)>temp.proyectionTotal){
        proyToShow = temp.allLabsTotal + temp.labTotal;
      }else{
        proyToShow = temp.proyectionTotal
      }

      this.chartOptionsArray.push({
        fullWidth: true,
        donut: true,
        showLabel: false,
        donutWidth: 25,
        height: '110px',
        width: '100%',
        total: proyToShow,
      })
    
    })

    console.log([this.chartDataArray,this.chartOptionsArray,this.chartDisplayArray])
  }

  input(element) {
    if (this.description.length > 2) {

        this.showSelect = true;
        this.labsoratoriesService.getLaboratoryByDescription(this.description).subscribe(data => {

            this.laboratories = data;
            //console.log("getLaboratoryByDescription:",data);
        });
    } else {
        this.showSelect = false;
        this.laboratories = [];
    }
  }

  blurInput($event){

    if(this.description.length == 0){
      this.showSelect = false;
      this.selectedMarcaId = "-1";
      this.selectedMarcaDesc = "Todos";
      this.updateCharts();
    }
  }

  selectMonth(value){
    this.showSelect = false;
    this.updateCharts();
  }

  selectKeyPress(labid,labdesc) {
    
    this.showSelect = false;
    this.showLoading = true;
    this.selectedMarcaId = labid;
    this.selectedMarcaDesc = labdesc;
    this.updateCharts();
    
  }

  selectClick(labid,labdesc) {
    this.showSelect = false;
    this.showLoading = true;
    this.selectedMarcaId = labid;
    this.selectedMarcaDesc = labdesc;
    this.updateCharts();
  }

  selectClickOption(labid,labdesc) {
    this.showSelect = false;
    this.showLoading = true;
    this.selectedMarcaId = labid;
    this.selectedMarcaDesc = labdesc;
    this.updateCharts();
  }

  barColor(percent) {
    percent = Number.parseFloat(percent);
    if(percent<=10.00){
      return "low"
    }else if(percent>10.00 && percent<=30.00){
      return "med"
    }else if(percent>=90.00){
      return "high"
    }else{
      return "norm"
    }
    
  }

}