import { Component, OnInit, Output, ViewChild,HostListener  } from '@angular/core';
import { ProductService } from '../services/product.service';
import { DateService } from '../services/date.service';
import { DatePipe } from '@angular/common';
import 'style-loader!./chartistJs.scss'; 



@Component({
    selector: 'sales-lab',
    templateUrl: './sales.lab.component.html',
    providers: [ProductService, DateService, DatePipe],
    styleUrls: ['./sales.lab.component.scss','../../theme/sass/user-defined/media-querys.scss']
})
export class SalesLabComponent {

    productoId: any;
    description: string;
    selectedUMedidaObj: any={};
    productSuggestionList=[];
    showSelect:boolean=false;
    selectedProductId:any;
    umedidaList:any = [];
    pricesList:any=[];
    rangesList:any=[];
    stockList:any=[];
    selectedProduct:any={};
    keys = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    public sales_lab_data:any;
    public prom_data:any;
    public simpleBarOptions:any;
    public sales_year:any;
    public sales_year_table:any;
    public simpleLineOptions:any;
    public years=[];
    
    constructor(private productSerive: ProductService,
        private dateService: DateService, private datePipe: DatePipe) {
        
        dateService.getServerDate().subscribe(date=>{
            let serverdate = new Date(date.server_date);
            this.years.push(serverdate.getFullYear())
            this.years.push(serverdate.getFullYear()-1);

        })
        this.simpleBarOptions = {
            fullWidth: true,
            height: '300px'
        }

        this.simpleLineOptions= {
            fullWidth: true,
            height: '300px',
            chartPadding: {
              right: 40
            }
        }
    }

    getColorFromIndex(index){
        if(index % 2 == 0){
            return 'series-a-light';
        }else{
            return 'series-b-light';
        }
    }

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        
        let selectedIndex = jQuery('#selectedProductId').prop('selectedIndex');
        let totalOptions = jQuery("#selectedProductId option").length;
        if(event.key === 'ArrowUp'){
            if(totalOptions>1){
                jQuery('#selectedProductId').prop('selectedIndex', selectedIndex - 1).change()
                this.productoId = jQuery('#selectedProductId option:selected').attr('ng-reflect-value');
            }
        }else if(event.key == 'ArrowDown'){
            if(selectedIndex<totalOptions){
                jQuery('#selectedProductId').prop('selectedIndex', selectedIndex + 1).change()
                this.productoId = jQuery('#selectedProductId option:selected').attr('ng-reflect-value');
            }
            
        }else if(event.key == 'Enter'){
            if(this.productoId){
                this.description = jQuery('#selectedProductId option:selected').text();
            }
            this.showSelect = false;
            this.getProductbyID();
        }
    }

    getLocaleValue(number){
        return number.toLocaleString('en-us');
    }

    getFormattedDate(date){
        
        let dateObj = new Date(date);
        
        return this.datePipe.transform(date,"dd/MM/yyyy");
        
    }

    getProductbyID() {

        this.productSerive.getSalesLabByPid(this.productoId).subscribe(data=>{

            this.sales_lab_data = data[0];

            this.prom_data = {
                labels:[
                    'Fecha Actual','Mes Actual','Mes Anterior','Prom. Últimos 2 Meses','Prom. Últimos 3 Meses','Prom. Últimos 6 Meses'
                ],
                series:[
                    [this.sales_lab_data.PromedioFecha,
                        this.sales_lab_data.VentasMesActual,
                        this.sales_lab_data.VentasMesAnterior,
                        this.sales_lab_data.Promedio2Meses,
                        this.sales_lab_data.Promedio3Meses,
                        this.sales_lab_data.Promedio6Meses],
                    [this.sales_lab_data.AAPromedioFecha,
                        this.sales_lab_data.VentasMesActualAA,
                        this.sales_lab_data.VentasMesAnteriorAA,
                        this.sales_lab_data.Promedio2AAMeses,
                        this.sales_lab_data.Promedio3AAMeses,
                        this.sales_lab_data.Promedio3AAMeses]
                ]
            }
            
            let tempcurrent=[];
            let tempprevious=[];
            this.keys.forEach(element=>{
                tempcurrent.push(this.sales_lab_data[element]);
                tempprevious.push(this.sales_lab_data['AA'+element])
            })

            this.sales_year={
                labels:this.keys,
                series:[
                    tempcurrent,
                    tempprevious
                ]
            }

            this.sales_year_table=[
                this.getBiMonthAvg(tempcurrent),
                this.getBiMonthAvg(tempprevious)
            ]
            

        })
    }

    getBiMonthAvg(valuearray){
        let temp = 0;
        let newArray = [];
        valuearray.forEach((elem,index)=>{
            newArray.push(elem);
            temp = temp + elem;
            if(index % 2 !== 0){
                newArray.push(temp/2);
                temp=0;
            }
        })

        return newArray;
    }

    getClassFromIndexColor(index){
        if(index+2%3===0){
            return 'avg-val';
        }
        return '';
    }

    selectClickOption($event,productid){
        console.log("selected product:",productid)
        this.productoId = productid;
        this.showSelect = false;
        this.getProductbyID();
    }

    selectClick(){
        this.productoId = jQuery('#selectedProductId option:selected').attr('ng-reflect-value');
        this.showSelect = false;
        this.getProductbyID();
    }

    input($event){
        if(this.description.length > 2){
          this.productSerive.getProductByDescription(this.description).subscribe(data=>{
            this.productSuggestionList=data;
            this.showSelect=true;
          });
        }else{
          this.productSuggestionList=[];
          this.showSelect=false;
        }
    }

}