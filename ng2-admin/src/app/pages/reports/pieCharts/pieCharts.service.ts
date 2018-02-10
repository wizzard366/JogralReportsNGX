import {Injectable} from '@angular/core';
import { ProductService } from '../../services/product.service'
import {BaThemeConfigProvider, colorHelper} from '../../../theme';
import { SalesMan } from '../salesman';

@Injectable()
export class PieChartsService {

  constructor(private productSerive: ProductService,private _baConfig:BaThemeConfigProvider) {
  }

  
  getData() {

    

    let pieColor = this._baConfig.get().colors.custom.dashboardPieChart;
    return [
      {
        color: pieColor,
        description: 'New Visits',
        stats: '57,820',
        icon: 'person',
      }, {
        color: pieColor,
        description: 'Purchases',
        stats: '$ 89,745',
        icon: 'money',
      }, {
        color: pieColor,
        description: 'Active Users',
        stats: '178,391',
        icon: 'face',
      }, {
        color: pieColor,
        description: 'Returned',
        stats: '32,592',
        icon: 'refresh',
      }
    ];
  }
}
