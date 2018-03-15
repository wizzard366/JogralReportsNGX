import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { ChartistJsService } from '../../../charts/components/chartistJs/chartistJs.service';
import { DateService } from '../../../services/date.service';



@Component({
    selector: 'product-info',
    templateUrl: './productInfo.component.html',
    providers: [ProductService, ChartistJsService,DateService]
})
export class ProductInfoComponent {

    id: any;
    public sub: any;
    public show_money: any;
    public graph_data_money: any;
    public graph_data_quantity: any;
    public labels: any;
    public graph_options: any;
    public product_name: any;
    public product_id: any;
    public product_marca: any;
    public show_quantites: any;
    public startDate;
    public endDate;
    public show_graph: boolean;
    public table_data:any;
    public date:any;




    constructor(private route: ActivatedRoute, 
        private productService: ProductService, 
        private chartistJsService: ChartistJsService,
        private dateService: DateService) {
        this.show_money = false;
        this.show_quantites = false;
        this.show_graph = false;
        this.table_data= [];
        this.labels = [];
        this.graph_options = this.chartistJsService.getAll()['simpleLineOptions'];

        this.dateService.getServerDate().subscribe(date=>{
            this.date = new Date(date.server_date);
            let currentYear=this.date.getFullYear();
            let currentMonth=this.date.getMonth()+1;
            let currentDay=this.date.getDate();

            this.startDate={
                day:1,
                month:currentMonth,
                year:currentYear
            }
            this.endDate={
                day:currentDay,
                month:currentMonth,
                year:currentYear
            }

            this.sub = this.route.params.subscribe(params => {
                this.id = params['pid'];
    
                this.productService.getProduct(this.id).subscribe(data => {
    
                    if (typeof data[0] !== 'undefined' && data[0] !== null) {
    
                        this.product_id = data[0].productoId;
                        this.product_marca = data[0].marca;
                        this.product_name = data[0].descripcion;
    
                    }
    
                    this.updateGraph(this.id,this.startDate,this.endDate);
                })
    
            })

            
        })

        


    }


    showGraph() {
        /* console.log('startDate:', this.startDate);
        console.log('endDate:', this.endDate); */
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
                        Cantidad:element.Cantidad.toLocaleString('en-US'),
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
