import { Component } from '@angular/core';
import { PurchasesService } from '../services/purchases.service'
import { LocalDataSource } from 'ng2-smart-table';
import {ShowCellComponent} from './show.cel.component';
import {MovComponent} from './mov.component';


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
      perPage:5 
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
        type: 'html',
        class: 'Descripcion-class',
        valuePrepareFunction:this.styleName
      },
      UMedidaId: {
        title: 'UMedidaId',
        type: 'text',
        class: 'UMedidaId-class',
      },
      DescUMedida: {
        title: 'DescUMedida',
        type: 'text',
        class: 'DescUMedida-class',
      },
      MarcaId: {
        title: 'MarcaId',
        type: 'text',
        class: 'MarcaId-class',
      },
      NombreMarca: {
        title: 'NombreMarca',
        type: 'text',
        class: 'NombreMarca-class',
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
      Factor: {
        title: 'Factor',
        type: 'text',
        class: 'Factor-class',
      },
      SaldoVencidos: {
        title: 'SaldoVencidos',
        type: 'text',
        class: 'SaldoVencidos-class',
      },
      VencidosActual: {
        title: 'VencidosActual',
        type: 'text',
        class: 'VencidosActual-class',
      },
      VentasInternas: {
        title: 'VentasInternas',
        type: 'text',
        class: 'VentasInternas-class',
      },
      StatusId: {
        title: 'StatusId',
        type: 'text',
        class: 'StatusId-class',
      },
      NIT: {
        title: 'NIT',
        type: 'text',
        class: 'NIT-class',
      },
      NomProveedor: {
        title: 'NomProveedor',
        type: 'text',
        class: 'NomProveedor-class',
      },
      FechaSol: {
        title: 'FechaSol',
        type: 'text',
        class: 'FechaSol-class',
      },
      CantidadSol: {
        title: 'CantidadSol',
        type: 'text',
        class: 'CantidadSol-class',
      },
      ObservaSol: {
        title: 'ObservaSol',
        type: 'text',
        class: 'ObservaSol-class',
      },
      FechaEntrega: {
        title: 'FechaEntrega',
        type: 'text',
        class: 'FechaEntrega-class',
      },
      Bonificacion: {
        title: 'Bonificacion',
        type: 'text',
        class: 'Bonificacion-class',
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
    return '<p>'+cell+'</p>'
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