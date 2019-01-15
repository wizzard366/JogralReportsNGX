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

  public table_data:LocalDataSource=new LocalDataSource();

  public settings = {
    actions: {
      add: false,
      edit: false,
      delete: false
    },
    pager:{
      perPage:15
    },
    hideSubHeader: false,
    noDataMessage: 'No se encontraron datos',
    columns: {
      ProductoId: {
        title: 'ProductoId',
        type: 'text',
        class: 'ProductoId-class',
      },
      Descripcion: {
        title: 'Descripcion',
        type: 'custom',
        class: 'Descripcion-class',
        //valuePrepareFunction:this.styleName
        renderComponent:DisplayDescriptionComponent
      },
      DescUMedida: {
        title: 'DescUMedida',
        type: 'custom',
        class: 'DescUMedida-class',
        renderComponent:DisplayDescriptionComponent
      },
      NombreMarca: {
        title: 'NombreMarca',
        type: 'custom',
        class: 'NombreMarca-class',
        renderComponent:DisplayDescriptionComponent
      },
      FechaUCompra: {
        title: 'FechaUCompra',
        type: 'text',
        class: 'FechaUCompra-class',
        valuePrepareFunction:this.formatDate
      },
      CantidadUCompra: {
        title: 'CantidadUCompra',
        type: 'text',
        class: 'CantidadUCompra-class',
      },
      DiasUCompra: {
        title: 'DiasUCompra',
        type: 'text',
        class: 'DiasUCompra-class',
      },
      FechaUVenta: {
        title: 'FechaUVenta',
        type: 'text',
        class: 'FechaUVenta-class',
        valuePrepareFunction:this.formatDate
      },
      CantidadUVenta: {
        title: 'CantidadUVenta',
        type: 'text',
        class: 'CantidadUVenta-class',
      },
      DiasUVenta: {
        title: 'DiasUVenta',
        type: 'text',
        class: 'DiasUVenta-class',
      },
      Promedio6Meses: {
        title: 'Promedio6Meses',
        type: 'text',
        class: 'Promedio6Meses-class',
      },
      Promedio3Meses: {
        title: 'Promedio3Meses',
        type: 'text',
        class: 'Promedio3Meses-class',
      },
      VentasMesAnterior: {
        title: 'VentasMesAnterior',
        type: 'text',
        class: 'VentasMesAnterior-class',
      },
      VentasMesActual: {
        title: 'VentasMesActual',
        type: 'text',
        class: 'VentasMesActual-class',
      },
      TotalVentas: {
        title: 'TotalVentas',
        type: 'text',
        class: 'TotalVentas-class',
      },
      SaldoActual: {
        title: 'SaldoActual',
        type: 'text',
        class: 'SaldoActual-class',
      },
      Sugerido: {
        title: 'Sugerido',
        type: 'text',
        class: 'Sugerido-class',
      },
      CoberturaMinima: {
        title: 'CoberturaMinima',
        type: 'text',
        class: 'CoberturaMinima-class',
      },
      Necesario: {
        title: 'Necesario',
        type: 'text',
        class: 'Necesario-class',
      },
      FlagId: {
        title: 'FlagId',
        type: 'custom',
        class: 'FlagId-class',
        valuePrepareFunction:(cell,row)=>{return {cell:cell,row:row}},
        renderComponent:ShowCellComponent
      },
      NomProveedor: {
        title: 'NomProveedor',
        type: 'text',
        class: 'NomProveedor-class',
      },
      MovActual: {
        title: 'MovActual',
        type: 'custom',
        class: 'MovActual-class',
        valuePrepareFunction:(cell,row)=>{return {cell:cell,row:row}},
        renderComponent:MovComponent

      },
      Mov3mes: {
        title: 'Mov3mes',
        type: 'custom',
        class: 'Mov3mes-class',
        valuePrepareFunction:(cell,row)=>{return {cell:cell,row:row}},
        renderComponent:MovComponent
      },
      Mov6: {
        title: 'Mov6',
        type: 'custom',
        class: 'Mov6-class',
        valuePrepareFunction:(cell,row)=>{return {cell:cell,row:row}},
        renderComponent:MovComponent
      },
      
    }


  }

  
  constructor(private purchasesService: PurchasesService) {

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

  
}