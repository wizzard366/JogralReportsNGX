import {Component,Input} from '@angular/core';

import { ChartistJsService } from '../../../charts/components/chartistJs/chartistJs.service';
import { chartistColorClasses } from '../../../../theme/chartist-color-classes';
import { LaboratoriesService } from '../../../services/laboratories.service';

import 'style-loader!../../../../theme/chartistJs.scss';
import { SellInSellOutService } from './sell-in-sell-out.service';
import { GeneratedFile } from '@angular/compiler';




@Component({
    selector: 'sellin-sellout',
    templateUrl: './sell-in-sell-out.component.html',
    providers: [ChartistJsService],
    styleUrls: ['sell-in-sell-out.component.scss']
})
export class SellInSellOutComponent {
    private keys2=["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
    chart_options:any;
    pid:any;
    mid:any;
    formattedData:any;
    graphData:any=[];
    tableData:any=[];
    series=[];
    public year=2019;
    public formateddata=[];
    public renderData=false;
    @Input() showOnlyMarca: string;

    constructor(private laboratoriesService: LaboratoriesService,private _chartistJsService:ChartistJsService,private sellInSellOutService: SellInSellOutService) {
        this.chart_options = this._chartistJsService.getAll()['simpleLineOptions'];


    }

    ngAfterViewInit(){
        if(this.showOnlyMarca == 'true'){
            this.sellInSellOutService.changeMarca.subscribe(data=>{
                this.renderMarca(data);
            })

        }else{
            this.sellInSellOutService.change.subscribe(data => {
                this.render(data[0],data[1]);
            });
        }
    }

    render(mid,pid){
        this.pid = pid;
        this.mid = mid;
        let year=2019;

        
        this.laboratoriesService.getSellInSellOutByMarcaAndProduct(mid,pid).subscribe(data=>{
            this.setParsedData(data);
            this.graphData = {
                labels:this.keys2,
                series:this.series
            }
        })
        this.renderData=true;
    
    }

    renderMarca(mid){

        this.mid = mid;
        this.laboratoriesService.getSellInSellOutByMarca(mid).subscribe(data=>{
            this.setParsedData(data);
            this.graphData = {
                labels:this.keys2,
                series:this.series
            }
        })
        this.renderData=true;
    }
    
    

    getLocalizedNumber(number){
        return number.toLocaleString('en-US');
    }

    setParsedData(data){
        this.series=[];
        this.tableData=[];
        let class_index=0;
        let tempSellOutNC;
        data.forEach(element=>{
            if(element.Operacion == 'SELL-OUT-NC'){
                tempSellOutNC = {
                    class:chartistColorClasses[class_index],
                    Operacion:element.Operacion,
                    Total:element.Total,
                    Enero:element.Enero,
                    Febrero:element.Febrero,
                    Marzo:element.Marzo,
                    Abril:element.Abril,
                    Mayo:element.Mayo,
                    Junio:element.Junio,
                    Julio:element.Julio,
                    Agosto:element.Agosto,
                    Septiembre:element.Septiembre,
                    Octubre:element.Octubre,
                    Noviembre:element.Noviembre,
                    Diciembre:element.Diciembre
                }
            }else{
                this.tableData.push({
                    class:chartistColorClasses[class_index],
                    Operacion:element.Operacion,
                    Total:element.Total,
                    Enero:element.Enero,
                    Febrero:element.Febrero,
                    Marzo:element.Marzo,
                    Abril:element.Abril,
                    Mayo:element.Mayo,
                    Junio:element.Junio,
                    Julio:element.Julio,
                    Agosto:element.Agosto,
                    Septiembre:element.Septiembre,
                    Octubre:element.Octubre,
                    Noviembre:element.Noviembre,
                    Diciembre:element.Diciembre
                })
                this.series.push([
                    element.Enero,
                    element.Febrero,
                    element.Marzo,
                    element.Abril,
                    element.Mayo,
                    element.Junio,
                    element.Julio,
                    element.Agosto,
                    element.Septiembre,
                    element.Octubre,
                    element.Noviembre,
                    element.Diciembre
                ])
                class_index = class_index + 1;
            }
        })

        if (typeof tempSellOutNC !== 'undefined'){
            let updateIndex=0;
            let index=0;
            this.tableData.forEach (element => {

                if(element.Operacion=='SELL-OUT'){
                    updateIndex = index;

                    element.Enero = parseInt(element.Enero) + parseInt(tempSellOutNC.Enero)
                    element.Febrero = parseInt(element.Febrero) + parseInt(tempSellOutNC.Febrero)
                    element.Marzo = parseInt(element.Marzo) + parseInt(tempSellOutNC.Marzo)
                    element.Abril = parseInt(element.Abril) + parseInt(tempSellOutNC.Abril)
                    element.Mayo = parseInt(element.Mayo) + parseInt(tempSellOutNC.Mayo)
                    element.Junio = parseInt(element.Junio) + parseInt(tempSellOutNC.Junio)
                    element.Julio = parseInt(element.Julio) + parseInt(tempSellOutNC.Julio)
                    element.Agosto = parseInt(element.Agosto) + parseInt(tempSellOutNC.Agosto)
                    element.Septiembre = parseInt(element.Septiembre) + parseInt(tempSellOutNC.Septiembre)
                    element.Octubre = parseInt(element.Octubre) + parseInt(tempSellOutNC.Octubre)
                    element.Noviembre = parseInt(element.Noviembre) + parseInt(tempSellOutNC.Noviembre)
                    element.Diciembre = parseInt(element.Diciembre) + parseInt(tempSellOutNC.Diciembre)
                    element.Total = parseInt(element.Total) + parseInt(tempSellOutNC.Total)

                }

                index = index + 1;
            })
            this.series[updateIndex][0] = parseInt(this.series[updateIndex][0]) + parseInt(tempSellOutNC.Enero)
            this.series[updateIndex][1] = parseInt(this.series[updateIndex][1]) + parseInt(tempSellOutNC.Febrero)
            this.series[updateIndex][2] = parseInt(this.series[updateIndex][2]) + parseInt(tempSellOutNC.Marzo)
            this.series[updateIndex][3] = parseInt(this.series[updateIndex][3]) + parseInt(tempSellOutNC.Abril)
            this.series[updateIndex][4] = parseInt(this.series[updateIndex][4]) + parseInt(tempSellOutNC.Mayo)
            this.series[updateIndex][5] = parseInt(this.series[updateIndex][5]) + parseInt(tempSellOutNC.Junio)
            this.series[updateIndex][6] = parseInt(this.series[updateIndex][6]) + parseInt(tempSellOutNC.Julio)
            this.series[updateIndex][7] = parseInt(this.series[updateIndex][7]) + parseInt(tempSellOutNC.Agosto)
            this.series[updateIndex][8] = parseInt(this.series[updateIndex][8]) + parseInt(tempSellOutNC.Septiembre)
            this.series[updateIndex][9] = parseInt(this.series[updateIndex][9]) + parseInt(tempSellOutNC.Octubre)
            this.series[updateIndex][10] = parseInt(this.series[updateIndex][10]) + parseInt(tempSellOutNC.Noviembre)
            this.series[updateIndex][11] = parseInt(this.series[updateIndex][11]) + parseInt(tempSellOutNC.Diciembre)
        }

        


    }
}