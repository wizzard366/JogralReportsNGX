import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { DateService } from '../services/date.service';
import { SalesMan } from '../reports/salesman';
import { ChartistJsService } from '../charts/components/chartistJs/chartistJs.service';

import { AuthenticationService } from '../services/oauth/authentication.service';
import { chartistColorClasses } from '../../theme/chartist-color-classes';
import 'style-loader!../../theme/chartistJs.scss';
import { EventEmitter } from 'events';



@Component({
    selector: 'sellers',
    templateUrl: './sellers.component.html',
    providers: [ProductService, ChartistJsService, DateService],
    styles: ['.nowrap{white-space:nowrap}']
})
export class SellersComponent {

    chart_options: any;
    sellers_names_data = [];
    sellers_graph_data: any;
    selected_seller: any;
    sellers_table_data = [];
    keys = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    salesMans = {};
    display_graph = false;
    display_pieChart = false;
    pieChartConff = 'mensual';
    date: any;
    selectedYear: any;
    selectedMonth: any;
    labelsPieData: any;
    labelsPieOptions: any;
    top_clients_graph_data: any;
    top_clients_table_data: any;
    graph_total:any;

    

    @Output() selectSellerMonth = new EventEmitter()

    constructor(private productSerive: ProductService,
        private authenticationService: AuthenticationService,
        private _chartistJsService: ChartistJsService,
        private dateService: DateService) {

        this.dateService.getServerDate().subscribe(date => {

            this.date = new Date(date.server_date);

            this.selectedYear = this.date.getFullYear();
            this.selectedMonth = this.date.getMonth();

            this.chart_options = this._chartistJsService.getAll()['simpleLineOptions'];
            this.productSerive.getSalesBySalesManProyectionsByYear(this.selectedYear).subscribe(data => {
                this.getSellersData(data);
            });



            this.labelsPieData = {
                labels: ['Bananas', 'Apples', 'Grapes'],
                series: [20, 15, 40]
            }
            this.labelsPieOptions = {
                fullWidth: true,
                height: '300px',
                weight: '300px',
                labelDirection: 'explode',

                labelInterpolationFnc: this.returnlabel,
            }


        });


    }

    
    returnlabel(value){
        
        //return Math.round(value / this.graph_total * 100) + '%';
        return '';
    }

    getSellersData(data) {

        data.forEach(element => {

            if (typeof this.salesMans === 'undefined' || typeof this.salesMans[element.VendedorId] === 'undefined' || this.salesMans[element.VendedorId] === null) {

                if (element.Fuente === 'Ventas') {
                    let temp = new SalesMan;
                    temp.setId(element.VendedorId);
                    temp.setName(element.Nombre);
                    temp.setCurrent(element.Total);
                    temp.setSales_history(element);

                    this.salesMans[element.VendedorId] = temp;

                } else if (element.Fuente === 'Proyeccion') {
                    let temp = new SalesMan;
                    temp.setId(element.VendedorId);
                    temp.setName(element.Nombre);
                    temp.setProyection(element.Total);
                    temp.setProyections(element);
                    this.salesMans[element.VendedorId] = temp;

                }
            } else {
                if (element.Fuente === 'Ventas') {
                    this.salesMans[element.VendedorId].setCurrent(element.Total);
                    this.salesMans[element.VendedorId].setSales_history(element);
                    if (typeof this.salesMans[element.VendedorId].proyection !== 'undefined') {
                        this.salesMans[element.VendedorId].setPercentageOfProyection();
                    }
                    if (typeof this.salesMans[element.VendedorId].sales_history !== 'undefined' && typeof this.salesMans[element.VendedorId].proyections !== 'undefined') {
                        this.sellers_names_data.push({ "name": element.Nombre, "id": element.VendedorId });
                    }
                } else if (element.Fuente === 'Proyeccion') {
                    this.salesMans[element.VendedorId].setProyection(element.Total);
                    this.salesMans[element.VendedorId].setProyections(element);
                    if (typeof this.salesMans[element.VendedorId].current !== 'undefined') {
                        this.salesMans[element.VendedorId].setPercentageOfProyection();
                    }
                    if (typeof this.salesMans[element.VendedorId].sales_history !== 'undefined' && typeof this.salesMans[element.VendedorId].proyections !== 'undefined') {
                        this.sellers_names_data.push({ "name": element.Nombre, "id": element.VendedorId });
                    }
                }
            }

        });







    }

    /* displays a seller on the graph.
    @id = the id of the seller to be displayed.*/

    displaySeller(seller_id) {
        
        this.sellers_table_data = [];
        this.sellers_graph_data = [];
        if (typeof this.salesMans[seller_id] !== 'undefined' && this.salesMans[seller_id] !== null) {
            let temp_salesMan = this.salesMans[seller_id];

            let temp_series_proyection = [];
            let temp_series_sales = [];

            this.keys.forEach(key => {

                if (typeof temp_salesMan.sales_history !== 'undefined') {
                    temp_series_sales.push(Number(temp_salesMan.sales_history[key]) / 10000);
                }
                if (typeof temp_salesMan.proyections !== 'undefined') {
                    temp_series_proyection.push(Number(temp_salesMan.proyections[key]) / 10000);
                }
            })

            let temp_data = {
                labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
                series: []
            };

            temp_data.series.push(temp_series_sales);
            temp_data.series.push(temp_series_proyection);


            this.sellers_graph_data = temp_data;


            temp_salesMan.sales_history["class"] = chartistColorClasses[0];
            temp_salesMan.proyections["class"] = chartistColorClasses[1];



            this.sellers_table_data.push(this.formatTableData(temp_salesMan.sales_history));

            this.sellers_table_data.push(this.formatTableData(temp_salesMan.proyections));



            this.display_graph = true;
        }

    }


    onYearSelected(paramArray) {
        let year = paramArray[0];
        let month = paramArray[1];

        this.productSerive.getSalesBySalesManProyectionsByYear(year).subscribe(data => {
            this.salesMans = {};
            this.sellers_names_data = [];
            this.getSellersData(data);
            if (typeof this.selected_seller !== 'undefined') {
                this.displaySeller(this.selected_seller);
            }
        });


        this.displayPieChart(year, month);
        


    }

    displayPieChart(year, month) {

        year = Number(year);
        month = Number(month) + 1;

        this.productSerive.getTopClientsBySalesman(this.selected_seller, year, month).subscribe(data => {

            if (typeof data[0] !== 'undefined' && data[0] !== null) {
                let tempLabels = [];
                let tempSeries = [];
                let tempTableData = [];
                let total=0;
                data.forEach((element, index) => {

                    tempLabels.push(element.Total);
                    tempSeries.push(element.Total);
                    total+=Number(element.Total);
                    tempTableData.push({
                        class: chartistColorClasses[index],
                        ClienteId: element.ClienteId,
                        Nombre: element.Nombre[0],
                        Total: element.Total.toLocaleString('en-US'),
                        Vendedor: element.Nombre[1]
                    })
                });
                this.graph_total=total;
                this.top_clients_graph_data = {
                    labels: tempLabels,
                    series: tempSeries
                }
                this.top_clients_table_data = tempTableData;
                this.display_pieChart = true;

            }else{
                this.display_pieChart = false;
            }



        })
    }


    selected() {


        this.displaySeller(this.selected_seller);
        this.displayPieChart(this.selectedYear, this.selectedMonth);


    }

    private formatTableData(data) {
        let returnData = [];
        this.keys.forEach(key => {
            returnData[key] = data[key].toLocaleString('en-US');
        });
        returnData['Fuente'] = data['Fuente'];
        returnData['class'] = data['class'];
        returnData["Total"] = data["Total"].toLocaleString('en-US');
        return returnData;
    }


    displayAllSales() {

        this.displaySeller("014");


    }
}
