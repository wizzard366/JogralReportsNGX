import {Component} from '@angular/core';

import { ClientsService } from '../services/clients.service';

import { ChartistJsService } from '../charts/components/chartistJs/chartistJs.service';
import { chartistColorClasses } from '../../theme/chartist-color-classes';
import { DateService } from '../services/date.service';
import 'style-loader!../../theme/chartistJs.scss';


@Component({
  selector: 'clients',
  templateUrl: './clients.html',
  providers: [ClientsService,ChartistJsService,DateService],
  styleUrls: ['../forms/components/inputs/components/selectInputs/selectInput.scss', '../../theme/sass/user-defined/media-querys.scss','./clients.scss']
})
export class ClientsComponent {

    
    keys=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
    keys2=["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
    extendedKeys=['Vendedor','Cliente','NombreCliente','Total','Ano','class']
    public clientName:string;
    public selectedClientId:any;
    public clients = [];
    public showSelect:any;
    public showNotFoundAlert:boolean;
    public showLoading:boolean;
    public chart_options:any;
    public graph_data:any;
    public table_data:any;
    public date:Date;
    public display_graph=false;
    public clienteId:any;
    public seller:any;
    public name:any;
    public currentYear:any;
    public barChartData:any;
    public barChartOptions:any;
    public labels:any;
    public clients_data:any;
    public years:any;

    constructor(private clientsSerivce:ClientsService,private _chartistJsService:ChartistJsService,private dateService:DateService) {
        this.showSelect=false;
        this.showLoading = false; 
        this.chart_options = this._chartistJsService.getAll()['simpleLineOptions'];
        this.labels=[];
        this.barChartOptions={
            fullWidth: true,
            height: '300px',
            axisX: {
                offset: 60
              }
        }

        this.dateService.getServerDate().subscribe(date=>{
            this.date=new Date(date.server_date);

            this.getTopClientsInfo();

            let currentYear= this.date.getFullYear();
            this.currentYear= this.date.getFullYear();
            this.years=[currentYear,currentYear-1,currentYear-2];


        })

        
    }

    isFirst(i){
        
        if (i===0){
            
            return true;
        }
        return false;
    }

    setSelectedYear(value){
        this.currentYear=value;
        
        this.getClientInfoByYear();
    }

    getClientInfoById(event){
        this.getClientInfo(this.clienteId,this.date.getFullYear());
    }

    getClientInfoByYear(){
        this.getClientInfo(this.clienteId,this.currentYear);
    }

    getClientInfo(clientId,year){
        this.showNotFoundAlert=false;
        let temp_graph_data=[];
        let temp_table_data=[];
        let series=[];
        this.graph_data=[];
        this.table_data=[];
        
        
        this.clientsSerivce.getClientInfo(clientId,year-2).subscribe(data=>{
            
            if (typeof data === 'undefined' || data.length == 0){
                this.showNotFoundAlert=true;
                this.display_graph=false;
            }else{
                this.clienteId=clientId;
                this.currentYear=year;
                let lastProcessedYear=0;
                data.forEach((element,index) => {
                    
                    if(lastProcessedYear===element[this.extendedKeys[4]]){
                        
                    }
                    this.keys.forEach(key=>{
                        
                        
                        temp_graph_data.push(Number(element[key]));
                        temp_table_data[key]=Number(element[key]).toLocaleString('en-US');
                        
    
                    })
                    lastProcessedYear=element[this.extendedKeys[4]];
                    temp_table_data[this.extendedKeys[3]]=Number(element[this.extendedKeys[3]]).toLocaleString('en-US');
                    temp_table_data[this.extendedKeys[4]]=Number(element[this.extendedKeys[4]]);
                    temp_table_data[this.extendedKeys[0]]=element[this.extendedKeys[0]];
                    temp_table_data[this.extendedKeys[5]]=chartistColorClasses[index];
                    
                    series.push(temp_graph_data);
                    temp_graph_data=[];
                    this.table_data.push(temp_table_data);
                    temp_table_data=[];
                    this.name=element[this.extendedKeys[2]];
                    this.seller=element[this.extendedKeys[0]];
                    
                    
                });   
                temp_graph_data=[];
                temp_table_data=[];
                this.graph_data={
                    series:series,
                    labels:this.keys2,
                }
                
                this.showLoading=false;
                this.display_graph=true;
            }            
        });  
    }


    getTopClientsInfo(){
        let series=[];
        this.clientsSerivce.getTopClients(this.date.getFullYear()).subscribe(data=>{

            this.clients_data=data;
            

            

            data.forEach(element=>{
                this.labels.push(element.NombreCliente);
                series.push(Number(element.Total)/10000);
                element.Total=element.Total.toLocaleString('en-US');
                this.keys.forEach(key=>{
                    element[key]=element[key].toLocaleString('en-US');
                })
            });

            this.barChartData={
                labels:this.labels,
                series:[]
            }
            this.barChartData.series.push(series);
            
            
        })
    }

    input(){
        if(this.clientName.length > 2){
            this.showSelect=true;
            this.clientsSerivce.getClientsByName(this.clientName).subscribe(data=>{
                this.clients=data;
            });
        }else{
            this.showSelect=false;
            this.clients=[];
        }

    }

    selectKeyPress($event){


    }

    selectClick($event){
        this.showSelect=false;
        this.showLoading=true;
        this.getClientInfo(this.selectedClientId,this.date.getFullYear());
        
    }

    selectClickOption($event,NombreComercial){

    }

}