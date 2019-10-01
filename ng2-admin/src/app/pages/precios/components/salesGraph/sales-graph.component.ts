import {Component} from '@angular/core';

import { ChartistJsService } from '../../../charts/components/chartistJs/chartistJs.service';
import { chartistColorClasses } from '../../../../theme/chartist-color-classes';
import { ProductService } from '../../../services/product.service';

import 'style-loader!../../../../theme/chartistJs.scss';



@Component({
  selector: 'sales-graph',
  templateUrl: './sales-graph.component.html',
  providers: [ChartistJsService],
  styleUrls: ['sales-graph.component.scss']
  
})
export class SalesGraphComponent {

  private keys2=["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  private keys=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  private date:any;
  public year:any;
  private _data:any;
  public productId:any;
  public chart_options:any;

  public money_graph_data:any;
  public quantities_graph_data:any;

  public money_table_data:any;
  public quantities_table_data:any;

  public show_quantites:any;

  public global_graph_data:any;
  public global_table_data:any;

  public display=false;

  constructor(private productSerive: ProductService,private _chartistJsService:ChartistJsService) {
    this.chart_options = this._chartistJsService.getAll()['simpleLineOptions'];

  }

  render(productId){
    
    this.productSerive.getLast3YearsSalesByProduct(productId).subscribe(data=>{
      
      this.transformData(data);
      
    })



  }

  transformData(data){
    console.log('data from server',data);
    let currentYear=0;
    let temp_money_total=0;
    let temp_qty_total=0;
    let temp_month_average_qty=0;
    let temp_month_average_money=0;

    let graphDataMoney=[];
    let graphDataQuantity=[]

    let tableDataMoney=[]
    let tableDataQuantity=[]


    
    let tempGraphDataQuantityRow=[];
    let tempGraphDataMoneyRow=[];
    let tempTableQuantityDataRow={}
    let tempTableMoneyDataRow={}

    let class_index=0;
    data.forEach(element=>{

      if(currentYear===0){
        currentYear=element.Ano;
        tempTableQuantityDataRow["Ano"]=currentYear;
        tempTableQuantityDataRow["class"]=chartistColorClasses[class_index];
        tempTableQuantityDataRow["Tipo"]="Cantidad Unidades";
        tempTableQuantityDataRow[this.keys[element.Mes-1]]=element.Cantidad.toLocaleString('en-US');
        temp_qty_total = temp_qty_total + element.Cantidad;
        temp_month_average_qty = temp_qty_total/element.Mes;
        tempTableQuantityDataRow['Total'] = temp_qty_total.toLocaleString('en-US');
        tempTableQuantityDataRow['MAverage'] = temp_month_average_qty.toLocaleString('en-US');
        tempTableMoneyDataRow["Ano"]=currentYear;
        tempTableMoneyDataRow["class"]=chartistColorClasses[class_index];
        tempTableMoneyDataRow["Tipo"]="Monto Quetzalez";
        tempTableMoneyDataRow[this.keys[element.Mes-1]]=element.Monto.toLocaleString('en-US');
        temp_money_total = temp_money_total + element.Monto;
        temp_month_average_money = temp_money_total/element.Mes;
        tempTableMoneyDataRow['Total'] = temp_money_total.toLocaleString('en-US');
        tempTableMoneyDataRow['MAverage'] = temp_month_average_money.toLocaleString('en-US');
        tempGraphDataMoneyRow.push(element.Monto);
        tempGraphDataQuantityRow.push(element.Cantidad);
        class_index++;
      }else if(element.Ano!==currentYear){
        currentYear=element.Ano;

        tableDataMoney.push(tempTableMoneyDataRow);
        tableDataQuantity.push(tempTableQuantityDataRow);
        graphDataMoney.push(tempGraphDataMoneyRow);
        graphDataQuantity.push(tempGraphDataQuantityRow);

        tempGraphDataQuantityRow=[];
        tempGraphDataMoneyRow=[];
        tempTableQuantityDataRow={};
        tempTableMoneyDataRow={};
        temp_money_total = 0;
        temp_qty_total = 0;

        tempTableQuantityDataRow["Ano"]=currentYear;
        tempTableQuantityDataRow["class"]=chartistColorClasses[class_index];
        tempTableQuantityDataRow[this.keys[element.Mes-1]]=element.Cantidad;
        tempTableQuantityDataRow["Tipo"]="Cantidad Unidades";
        tempTableQuantityDataRow[this.keys[element.Mes-1]]=element.Cantidad.toLocaleString('en-US');
        temp_qty_total = temp_qty_total + element.Cantidad;
        temp_month_average_qty = temp_qty_total/element.Mes;
        tempTableQuantityDataRow['Total'] = temp_qty_total.toLocaleString('en-US');
        tempTableQuantityDataRow['MAverage'] = temp_month_average_qty.toLocaleString('en-US');
        tempTableMoneyDataRow["Ano"]=currentYear;
        tempTableMoneyDataRow["class"]=chartistColorClasses[class_index];
        tempTableMoneyDataRow["Tipo"]="Monto Quetzalez";
        tempTableMoneyDataRow[this.keys[element.Mes-1]]=element.Monto.toLocaleString('en-US');
        temp_money_total = temp_money_total + element.Monto;
        temp_month_average_money = temp_money_total/element.Mes;
        tempTableMoneyDataRow['Total'] = temp_money_total.toLocaleString('en-US');
        tempTableMoneyDataRow['MAverage'] = temp_month_average_money.toLocaleString('en-US');
        tempGraphDataMoneyRow.push(element.Monto);
        tempGraphDataQuantityRow.push(element.Cantidad);
        class_index++;

      }else{
        tempTableQuantityDataRow[this.keys[element.Mes-1]]=element.Cantidad.toLocaleString('en-US');
        temp_qty_total = temp_qty_total + element.Cantidad;
        temp_month_average_qty = temp_qty_total/element.Mes;
        tempTableQuantityDataRow['Total'] = temp_qty_total.toLocaleString('en-US');
        tempTableQuantityDataRow['MAverage'] = temp_month_average_qty.toLocaleString('en-US');
        tempTableMoneyDataRow[this.keys[element.Mes-1]]=element.Monto.toLocaleString('en-US');
        temp_money_total = temp_money_total + element.Monto;
        temp_month_average_money = temp_money_total/element.Mes;
        tempTableMoneyDataRow['MAverage'] = temp_month_average_money.toLocaleString('en-US');
        tempTableMoneyDataRow['Total'] = temp_money_total.toLocaleString('en-US');
        tempGraphDataMoneyRow.push(element.Monto);
        tempGraphDataQuantityRow.push(element.Cantidad);
      }


    });
    tableDataMoney.push(tempTableMoneyDataRow);
    tableDataQuantity.push(tempTableQuantityDataRow);
    graphDataMoney.push(tempGraphDataMoneyRow);
    graphDataQuantity.push(tempGraphDataQuantityRow);



    this.money_graph_data={
      labels:this.keys2,
      series:graphDataMoney
    }
    this.quantities_graph_data={
      labels:this.keys2,
      series:graphDataQuantity
    }

    this.money_table_data=tableDataMoney;
    this.quantities_table_data=tableDataQuantity;

    /* this.global_graph_data=this.money_graph_data;
    this.global_table_data=this.money_table_data; */

    this.display=true;
    


  }

}