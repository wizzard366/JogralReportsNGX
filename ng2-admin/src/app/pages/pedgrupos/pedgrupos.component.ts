import { Component } from '@angular/core';
import { ProductService } from '../services/product.service';
import { DateService } from '../services/date.service';
import { PedidosService } from '../services/pedidos.service';
import { LocalDataSource } from 'ng2-smart-table';
import { BoolShowComponent } from './boolshow.cell.component';
import { GrupoNumberComponent } from './gruponumber.cell.component';



@Component({
  selector: 'pedgrupos-component',
  templateUrl: 'pedgrupos.component.html',
  providers: [ProductService, DateService],
  styleUrls: ['./pedgrupos.component.scss']
})
export class PedGruposComponent {

    public table_data:LocalDataSource=new LocalDataSource([]);

    public settings = {
      actions: {
        add: false,
        edit: false,
        delete: false
      },
      pager:{
        perPage:25
      },
      hideSubHeader: false,
      noDataMessage: 'No se encontraron datos',
      columns: {
        NumeroGrupo: {
          title: 'No. Grupo',
          type: 'custom',
          class: 'numero-grupo',
          renderComponent:GrupoNumberComponent,
          filter:false
        },
        ClienteId: {
          title: 'Cliente ID',
          type: 'text',
          class: 'cliente-id',
          filter:false
        },
        Nombre: {
          title: 'Nombre Cliente',
          type: 'text',
          class: 'cliente-id',
          filter:false
        },
        Fecha: {
            title: 'Fecha',
            type: 'text',
            valuePrepareFunction:this.formatDate,
            class: 'cliente-id',
            filter:false
        },
        TotalGrupo: {
            title: 'Total Grupo',
            type: 'text',
            class: 'cliente-id',
            valuePrepareFunction:this.formatMoney,
            filter:false
        },
        UsuarioId: {
            title: 'Usuario ID',
            type: 'text',
            class: 'cliente-id',
            filter:false
        },
        Impreso: {
            title: 'Escaneado',
            type: 'custom',
            class: 'cliente-id',
            renderComponent:BoolShowComponent,
            filter:false
        }, 
        AplicadoInvent: {
            title: 'Aplicado',
            type: 'custom',
            renderComponent:BoolShowComponent,
            class: 'cliente-id',
            filter:false
        },
        Terminado: {
            title: 'Terminado',
            type: 'custom',
            renderComponent:BoolShowComponent,
            class: 'cliente-id',
            filter:false
        }
        
      }
  
  
    }

    constructor(private pedidosService:PedidosService){

        //let usuarioId = JSON.parse(localStorage.getItem('currentUser')).username;

        let usuarioId = 'rocio';

        pedidosService.WFACPedidoGrupoUsuarioRetrieveAsJsonCurrentUser(usuarioId).subscribe(data=>{
            console.log('WFACPedidoGrupoUsuarioRetrieveAsJsonCurrentUser',data);
            this.table_data.load(data) ;
        })
    }

    onSearch(query: string = '') {

        if(query === ''){
            query = ' ';
        }
    
        this.table_data.setFilter([
            // fields we want to include in the search
            {
                field: 'NumeroGrupo',
                search: query
            },
            {
                field: 'Nombre',
                search: query
            },
            {
              field:'UsuarioId',
              search:query
            }
        ], false);
    }

    formatDate(cell,row){
        let delimiter = '/'
        let newDate = new Date(cell);
        let day = newDate.getDate();
        let month = newDate.getMonth();
        let year = newDate.getFullYear();
        return '' + day + delimiter + (month + 1) + delimiter + year;
      }

    formatMoney(cell:Number,row){
        return `Q.${cell.toLocaleString('en-US')}`;
    }

}