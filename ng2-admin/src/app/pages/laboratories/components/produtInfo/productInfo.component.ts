import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { ChartistJsService } from '../../../charts/components/chartistJs/chartistJs.service';



@Component({
    selector: 'product-info',
    templateUrl: './productInfo.component.html',
    providers: [ProductService, ChartistJsService]
})
export class ProductInfoComponent {

    id: any;
    private sub: any;
    private show_money: any;
    private graph_data_money: any;
    private graph_data_quantity: any;
    private labels: any;
    private graph_options: any;
    private product_name: any;
    private product_id: any;
    private product_marca: any;
    private show_quantites: any;
    private startDate;
    private endDate;
    private show_graph: boolean;
    private table_data:any;




    constructor(private route: ActivatedRoute, private productService: ProductService, private chartistJsService: ChartistJsService) {
        this.show_money = false;
        this.show_quantites = false;
        this.show_graph = false;
        this.table_data= [];
        this.labels = [];
        this.graph_options = this.chartistJsService.getAll()['simpleLineOptions'];

        this.sub = this.route.params.subscribe(params => {
            this.id = params['pid'];

            this.productService.getProduct(this.id).subscribe(data => {



                if (typeof data[0] !== 'undefined' && data[0] !== null) {

                    this.product_id = data[0].productoId;
                    this.product_marca = data[0].marca;
                    this.product_name = data[0].descripcion;

                }


            })

        })


    }


    showGraph() {
        console.log('startDate:', this.startDate);
        console.log('endDate:', this.endDate);
        this.updateGraph(this.product_id, this.startDate, this.endDate);
    }

    updateGraph(pid, startDate, endDate) {

        let start: any;
        let end: any;

        start = '' + startDate.year.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + '-'
            + startDate.month.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + '-'
            + startDate.day.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });

        end = '' + endDate.year.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + '-'
            + endDate.month.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + '-'
            + endDate.day.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });


        this.productService.getSalesByProduct(pid, start, end).subscribe(data => {
            this.table_data=[];
            let graph_data_money = [];
            let graph_data_quantity = [];
            this.labels = [];
            let tempQ=0;
            data.forEach(element => {
                
                if (typeof element !== 'undefined' && element !== null) {
                    this.labels.push(this.parseDate(element.Fecha,'-'));
                   
                    tempQ+=element.Monto;
                    this.table_data.push({
                        Fecha:this.parseDate(element.Fecha,'/'),
                        Monto:element.Monto.toLocaleString('en-US'),
                        Cantidad:element.Cantidad,
                        Total:tempQ.toLocaleString('en-US')
                    });
                    graph_data_money.push(element.Monto);
                    graph_data_quantity.push(element.Cantidad);

                } else {
                    this.show_graph = false;
                }

            });
            this.graph_data_money = {
                labels: this.labels,
                series: [graph_data_money]
            }
            this.graph_data_quantity = {
                labels: this.labels,
                series: [graph_data_quantity]
            }
            this.show_graph = true;


        });
    }

    ngOnInit() {




    }
    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    parseDate(date: string,delimiter) {

        let newDate = new Date(date);
        let day = newDate.getDate();
        let month = newDate.getMonth();
        let year = newDate.getFullYear();


        return '' + day + delimiter + (month + 1) + delimiter + year;
    }

}
