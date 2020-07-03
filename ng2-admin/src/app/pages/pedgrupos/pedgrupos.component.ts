import { Component } from '@angular/core';
import { ProductService } from '../services/product.service';
import { DateService } from '../services/date.service';
import { PedidosService } from '../services/pedidos.service';



@Component({
  selector: 'pedgrupos-component',
  templateUrl: 'pedgrupos.component.html',
  providers: [ProductService, DateService],
  styleUrls: ['./pedgrupos.component.scss']
})
export class PedGruposComponent {

    constructor(private pedidosService:PedidosService){

        //let usuarioId = JSON.parse(localStorage.getItem('currentUser')).username;

        let usuarioId = 'rocio';

        pedidosService.WFACPedidoGrupoUsuarioRetrieveAsJsonCurrentUser(usuarioId).subscribe(data=>{
            console.log('WFACPedidoGrupoUsuarioRetrieveAsJsonCurrentUser',data);
        })
    }

}