import { Component } from '@angular/core';
import { PurchasesService } from '../services/purchases.service'
import { LocalDataSource } from 'ng2-smart-table';
import {ShowCellComponent} from './show.cel.component';
import {MovComponent} from './mov.component';
import {DisplayDescriptionComponent} from './displaydescription.component'


@Component({
  selector: 'precios-search',
  templateUrl: 'purchases.component.html',
  providers: [PurchasesService],

})
export class PurchasesComponent {

  public table_data:LocalDataSource=new LocalDataSource([]);

  public settings = {
    actions: {
      add: false,
      edit: false,
      delete: false
    },
    pager:{
      perPage:10
    },
    hideSubHeader: false,
    noDataMessage: 'No se encontraron datos',
    columns: {
      ProductoId: {
        title: 'ProductoId',
        type: 'text',
        class: 'ProductoId-class',
        filter:false
      },
      Descripcion: {
        title: 'Descripcion',
        type: 'custom',
        class: 'Descripcion-class',
        renderComponent:DisplayDescriptionComponent,
        filter:false
      },
      DescUMedida: {
        title: 'DescUMedida',
        type: 'custom',
        class: 'DescUMedida-class',
        renderComponent:DisplayDescriptionComponent,
        filter:false
      },
      NombreMarca: {
        title: 'NombreMarca',
        type: 'custom',
        class: 'NombreMarca-class',
        renderComponent:DisplayDescriptionComponent,
        filter:false
      },
      FechaUCompra: {
        title: 'FechaUCompra',
        type: 'text',
        class: 'FechaUCompra-class',
        valuePrepareFunction:this.formatDate,
        filter:false
      },
      CantidadUCompra: {
        title: 'CantidadUCompra',
        type: 'text',
        class: 'CantidadUCompra-class',
        filter:false
      },
      DiasUCompra: {
        title: 'DiasUCompra',
        type: 'text',
        class: 'DiasUCompra-class',
        filter:false
      },
      FechaUVenta: {
        title: 'FechaUVenta',
        type: 'text',
        class: 'FechaUVenta-class',
        valuePrepareFunction:this.formatDate,
        filter:false
      },
      CantidadUVenta: {
        title: 'CantidadUVenta',
        type: 'text',
        class: 'CantidadUVenta-class',
        filter:false
      },
      DiasUVenta: {
        title: 'DiasUVenta',
        type: 'text',
        class: 'DiasUVenta-class',
        filter:false
      },
      Promedio6Meses: {
        title: 'Promedio6Meses',
        type: 'text',
        class: 'Promedio6Meses-class',
        filter:false
      },
      Promedio3Meses: {
        title: 'Promedio3Meses',
        type: 'text',
        class: 'Promedio3Meses-class',
        filter:false
      },
      VentasMesAnterior: {
        title: 'VentasMesAnterior',
        type: 'text',
        class: 'VentasMesAnterior-class',
        filter:false
      },
      VentasMesActual: {
        title: 'VentasMesActual',
        type: 'text',
        class: 'VentasMesActual-class',
        filter:false
      },
      TotalVentas: {
        title: 'TotalVentas',
        type: 'text',
        class: 'TotalVentas-class',
        filter:false
      },
      SaldoActual: {
        title: 'SaldoActual',
        type: 'text',
        class: 'SaldoActual-class',
        filter:false
      },
      Sugerido: {
        title: 'Sugerido',
        type: 'text',
        class: 'Sugerido-class',
        filter:false
      },
      CoberturaMinima: {
        title: 'CoberturaMinima',
        type: 'text',
        class: 'CoberturaMinima-class',
        filter:false
      },
      Necesario: {
        title: 'Necesario',
        type: 'text',
        class: 'Necesario-class',
        filter:false
      },
      FlagId: {
        title: 'FlagId',
        type: 'custom',
        class: 'FlagId-class',
        valuePrepareFunction:(cell,row)=>{return {cell:cell,row:row}},
        renderComponent:ShowCellComponent,
        filter:false
      },
      NomProveedor: {
        title: 'NomProveedor',
        type: 'text',
        class: 'NomProveedor-class',
        filter:false
      },
      MovActual: {
        title: 'MovActual',
        type: 'custom',
        class: 'MovActual-class',
        valuePrepareFunction:(cell,row)=>{return {cell:cell,row:row}},
        renderComponent:MovComponent,
        filter:false

      },
      Mov3mes: {
        title: 'Mov3mes',
        type: 'custom',
        class: 'Mov3mes-class',
        valuePrepareFunction:(cell,row)=>{return {cell:cell,row:row}},
        renderComponent:MovComponent,
        filter:false
      },
      Mov6: {
        title: 'Mov6',
        type: 'custom',
        class: 'Mov6-class',
        valuePrepareFunction:(cell,row)=>{return {cell:cell,row:row}},
        renderComponent:MovComponent,
        filter:false
      },
      
    }


  }

  
  constructor(private purchasesService: PurchasesService) {

    console.log("getting.... purchaces")

    purchasesService.getPurchases().subscribe(data => {
        
      this.table_data.load(data) ;
    })


  }

  styleName(cell){
    return '<div style="white-space:nowrap">'+cell+'</div>'
  }

  formatDate(cell,row){
    let delimiter = '/'
    let newDate = new Date(cell);
    let day = newDate.getDate();
    let month = newDate.getMonth();
    let year = newDate.getFullYear();
    return '' + day + delimiter + (month + 1) + delimiter + year;
  }

  onSearch(query: string = '') {

    if(query === ''){
        query = ' ';
    }

    this.table_data.setFilter([
        // fields we want to include in the search
        {
            field: 'Descripcion',
            search: query
        },
        {
            field: 'ProductoId',
            search: query
        },
        {
          field:'NombreMarca',
          search:query
        }
    ], false);
}

  
}