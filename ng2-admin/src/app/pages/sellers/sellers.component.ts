import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import {ProductService} from '../services/product.service';
import {DateService} from '../services/date.service';
import {SalesMan} from '../reports/salesman';
import { ChartistJsService } from '../charts/components/chartistJs/chartistJs.service';

import { AuthenticationService } from '../services/oauth/authentication.service';
import { chartistColorClasses } from '../../theme/chartist-color-classes';
import 'style-loader!../../theme/chartistJs.scss';


@Component({
  selector: 'sellers',
  templateUrl: './sellers.component.html',
  providers: [ProductService, ChartistJsService,DateService],
  styles:['.nowrap{white-space:nowrap}']
})
export class SellersComponent {

    chart_options:any;
    sellers_names_data=[];
    sellers_graph_data:any;
    selected_seller:any;
    sellers_table_data=[];
    keys=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
    salesMans={};
    display_graph=false;
    pieChartConff='mensual';
    date:any;
    selectedYear:any;

  constructor(private productSerive: ProductService,
        private authenticationService: AuthenticationService,
        private _chartistJsService: ChartistJsService,
        private dateService:DateService) {

        this.dateService.getServerDate().subscribe(date=>{

            this.date=new Date(date.server_date);

            this.selectedYear=this.date.getFullYear();

            this.chart_options = this._chartistJsService.getAll()['simpleLineOptions'];
            this.productSerive.getSalesBySalesManProyectionsByYear(this.selectedYear).subscribe(data=>{
                this.getSellersData(data);    
            });
        });
  }

    getSellersData(data){

        data.forEach(element => {

            if( typeof this.salesMans === 'undefined' || typeof this.salesMans[element.VendedorId] ===  'undefined' || this.salesMans[element.VendedorId]===null){

                if(element.Fuente==='Ventas'){
                    let temp = new SalesMan;
                    temp.setId(element.VendedorId);
                    temp.setName(element.Nombre);
                    temp.setCurrent(element.Total);
                    temp.setSales_history(element);
                    
                    this.salesMans[element.VendedorId]=temp;
                
                }else if(element.Fuente==='Proyeccion'){
                    let temp = new SalesMan;
                    temp.setId(element.VendedorId);
                    temp.setName(element.Nombre);
                    temp.setProyection(element.Total);
                    temp.setProyections(element);
                    this.salesMans[element.VendedorId]=temp;
            
                }
            }else{
                if(element.Fuente==='Ventas'){
                    this.salesMans[element.VendedorId].setCurrent(element.Total);
                    this.salesMans[element.VendedorId].setSales_history(element);
                    if(typeof this.salesMans[element.VendedorId].proyection !== 'undefined'){
                        this.salesMans[element.VendedorId].setPercentageOfProyection();
                    }
                    if(typeof this.salesMans[element.VendedorId].sales_history !== 'undefined' && typeof this.salesMans[element.VendedorId].proyections !== 'undefined'){
                        this.sellers_names_data.push({"name":element.Nombre,"id":element.VendedorId});
                    }
                }else if(element.Fuente==='Proyeccion'){
                    this.salesMans[element.VendedorId].setProyection(element.Total);
                    this.salesMans[element.VendedorId].setProyections(element);
                    if(typeof this.salesMans[element.VendedorId].current !== 'undefined'){
                        this.salesMans[element.VendedorId].setPercentageOfProyection();
                    }
                    if(typeof this.salesMans[element.VendedorId].sales_history !== 'undefined' && typeof this.salesMans[element.VendedorId].proyections !== 'undefined'){
                        this.sellers_names_data.push({"name":element.Nombre,"id":element.VendedorId});
                    }
                }
            }    
            
        });   
        


        

       
        
    }

    /* displays a seller on the graph.
    @id = the id of the seller to be displayed.*/

    displaySeller(seller_id){
        this.sellers_table_data=[];
        this.sellers_graph_data=[];
        if(typeof this.salesMans[seller_id] !== 'undefined' && this.salesMans[seller_id] !== null){
            let temp_salesMan=this.salesMans[seller_id];
            
            let temp_series_proyection=[];
            let temp_series_sales=[];
            
            this.keys.forEach(key=>{
                
                if(typeof temp_salesMan.sales_history !== 'undefined'){
                    temp_series_sales.push(Number(temp_salesMan.sales_history[key]) / 10000);
                }
                if(typeof temp_salesMan.proyections !== 'undefined'){
                    temp_series_proyection.push(Number(temp_salesMan.proyections[key]) / 10000);
                }
            })

            let temp_data={
                labels:["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"],
                series:[]
            };
            
            temp_data.series.push(temp_series_sales);
            temp_data.series.push(temp_series_proyection);
            
            
            this.sellers_graph_data=temp_data;
            

            temp_salesMan.sales_history["class"]=chartistColorClasses[0];
            temp_salesMan.proyections["class"]=chartistColorClasses[1];

        
            
            this.sellers_table_data.push(this.formatTableData(temp_salesMan.sales_history));
            
            this.sellers_table_data.push(this.formatTableData(temp_salesMan.proyections));
            
            
            
            this.display_graph=true;
        }
        
    }
    

    onYearSelected(year){
        
        this.productSerive.getSalesBySalesManProyectionsByYear(year).subscribe(data=>{
            this.salesMans={};
            this.sellers_names_data=[];
            this.getSellersData(data); 
            if(typeof this.selected_seller !== 'undefined'){
                this.displaySeller(this.selected_seller); 
            }   
        });
    }

    selected(){
        
        
        this.displaySeller(this.selected_seller);

    }

    private formatTableData(data){
        let returnData=[];
        this.keys.forEach(key=>{
            returnData[key]=data[key].toLocaleString('en-US');
        });
        returnData['Fuente']=data['Fuente'];
        returnData['class']=data['class'];
        returnData["Total"]=data["Total"].toLocaleString('en-US');
        return returnData;
    }


    displayAllSales(){
        
        this.displaySeller("014");
        

    }
}
