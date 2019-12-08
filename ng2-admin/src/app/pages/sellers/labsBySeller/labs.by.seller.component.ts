import { Component, OnInit,Input } from '@angular/core';
import { DateService } from '../../services/date.service';
import { LaboratoriesService } from '../../services/laboratories.service';

import 'easy-pie-chart/dist/jquery.easypiechart.js';
import 'style-loader!./labs.by.seller.scss';

@Component({
    selector: 'labs-by-seller',
    templateUrl: './labs.by.seller.component.html',
    providers: [DateService,LaboratoriesService]/* ,
    styleUrls:['./labs.by.seller.component.scss'] */
})

export class LabsBySellercomponent {
    public labsBySellerParsedData:any={};
    public keys=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
    public selectedMonth:any;
    public date:any;
    public chartsData:any;

    @Input() seller: string; 
    
    

    constructor(private productSerive: LaboratoriesService,
        private dateService: DateService){


            this.dateService.getServerDate().subscribe(date=>{

                this.date = new Date(Number(date.server_date));
                this.selectedMonth = this.date.getMonth();
                //this.selectedYear = this.date.getFullYear();
                this.productSerive.getLabsbySeller().subscribe(data=>{
                    data.forEach(element => {
                        this.addElement(element)
                    });
                    this.selectMonth(this.selectedMonth);
                })


            })

            
    }


    ngOnChanges(changes){
        console.log("seller changed");
        this.selectMonth(this.seller)
    }

    selectMonth(event){

        if(this.selectedMonth && this.seller){
            let month= Number.parseInt(this.selectedMonth);
            let seller= Number.parseInt(this.seller);
            
            this.updateChartsData(this.labsBySellerParsedData[seller],month)
        }
    }

    updateChartsData(selectedData,month){
        let charts:any=[];

        let name:any;
        let proyection:any;
        let sales:any;
        let percentage:any;
        

        for(let lab in selectedData){

            name = selectedData[lab].Proyeccion.Descripcion
            proyection =selectedData[lab].Proyeccion[this.keys[month]]
            sales = selectedData[lab].Ventas[this.keys[month]]
            percentage = (sales/proyection)*100
            
            if(proyection===0||isNaN(percentage)){
                percentage=0;
            }

            charts.push({
                name:name,
                proyection:proyection.toLocaleString('en-US'),
                sales:sales.toLocaleString('en-US'),
                percentage:percentage
            })
        }
        
        this.chartsData=charts;
        this._loadPieCharts(1000);
    }


    addElement(element:any){
        let VendedorId =Number.parseInt(element.VendedorId)
        let MarcaId = Number.parseInt(element.MarcaId)

        if (typeof this.labsBySellerParsedData[VendedorId] === 'undefined'){
            this.labsBySellerParsedData[VendedorId]={};
        }
        if (typeof this.labsBySellerParsedData[VendedorId][MarcaId] === 'undefined'){
            this.labsBySellerParsedData[VendedorId][MarcaId]={};
        }

        if (element.Fuente === 'Proyeccion'){
            this.labsBySellerParsedData[VendedorId][MarcaId].Proyeccion=element
        }else{
            this.labsBySellerParsedData[VendedorId][MarcaId].Ventas=element
        }
        
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