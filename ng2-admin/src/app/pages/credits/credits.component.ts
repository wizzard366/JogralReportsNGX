import { Component } from '@angular/core';
import { MoneyflowService } from '../services/money.flow.service';
import { DateService } from '../services/date.service';
import { chartistColorClasses } from '../../theme/chartist-color-classes';
import 'style-loader!../../theme/chartistJs.scss';

import { ChartistJsService } from '../charts/components/chartistJs/chartistJs.service';


@Component({
  selector: 'credits-component',
  templateUrl: 'credits.component.html',
  providers: [MoneyflowService, DateService, ChartistJsService],
  styleUrls: ['../../theme/sass/user-defined/media-querys.scss','./credits.component.scss']
})
export class CreditsComponent {

    cretids_chart_data:any;
    labels_array=['Más de 120 días','De 90 - 120 días','De 60 - 90 días','De 30 - 60 días','De 15 - 30 días','Corriente'];
    keys_array=['Ciento20Mas','NoventaCiento20','SesentaNoventa','TreintaSesenta','QuinceTreinta','Corriente'];
    chart_options:any;
    table_data=[];
    table_data_detail=[];
    total_amount:any;
    show_detail:any;
    detail_title:any;
    constructor(private moneyflowService: MoneyflowService,
        private dateService: DateService,
        private _chartistJsService: ChartistJsService) {
            
            moneyflowService.getCurrentMoneyFlowBallance().subscribe(data=>{
                this.chart_options = {
                    fullWidth: true,
                    height: '300px',
                    weight: '300px',
                    labelDirection: 'explode',
                    labelInterpolationFnc:this.returnLabel
    
                }
                let series_array=[];
                this.keys_array.forEach((element,index)=>{
                    series_array.push(data[0][element]);
                    this.table_data.push({
                        class:chartistColorClasses[index],
                        number:data[0][element].toLocaleString('en-US'),
                        label:this.labels_array[index],
                    })
                })
                
                this.total_amount=data[0]['Saldo'].toLocaleString('en-US');
                
                this.cretids_chart_data={
                    labels:this.labels_array,
                    series:series_array
                }

            })

      }


      returnLabel(value){
          return '';
      }

      showDetailInterval(element:any){

        this.moneyflowService.getCurrentMoneyFlowBallancePerInterval(this.keys_array[element]).subscribe((data)=>{

            this.table_data_detail = data;
            this.show_detail = true;
            this.detail_title = this.labels_array[element]

        })
      }

      getValue(number:any){
          return number.toLocaleString('en-US');
      }

}