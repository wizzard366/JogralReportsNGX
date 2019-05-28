import { Routes, RouterModule }  from '@angular/router';
import { Pages } from './pages.component';
import { ModuleWithProviders } from '@angular/core';
// noinspection TypeScriptValidateTypes
import { AuthGuard } from './services/oauth/auth.guard.component';
// export function loadChildren(path) { return System.import(path); };

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: 'app/pages/login/login.module#LoginModule'
  },
  {
    path: 'livedashboard',
    loadChildren: 'app/pages/sellers/live_dashboard/liveDashboard.module#LiveDashboardModule'
  },
  {
    path: 'register',
    loadChildren: 'app/pages/register/register.module#RegisterModule'
  },
  {
    path: 'pages',
    component: Pages,
    children: [
      { path: '', redirectTo: 'reportes', pathMatch: 'full' },
      { path: 'precios', loadChildren: 'app/pages/precios/precios.module#PreciosModule',canActivate: [AuthGuard]},
      { path: 'precios/:pid', loadChildren: 'app/pages/precios/precios.module#PreciosModule',canActivate: [AuthGuard]},
      { path: 'reportes', loadChildren: 'app/pages/reports/reports.module#ReportsModule', canActivate: [AuthGuard]},
      { path: 'labs', loadChildren: 'app/pages/laboratories/labs.module#LabsModule', canActivate: [AuthGuard]},
      
      { path: 'vendedores', loadChildren: 'app/pages/sellers/sellers.module#SellersModule', canActivate: [AuthGuard]},
      { path: 'clientes', loadChildren: 'app/pages/clients/clients.module#ClientsModule', canActivate: [AuthGuard]},
      { path: 'ventas', loadChildren: 'app/pages/sales/sales.module#SalesModule', canActivate: [AuthGuard]},
      { path: 'compras', loadChildren: 'app/pages/purchases/purchases.module#PurchasesModule', canActivate: [AuthGuard]},
      { path: 'creditos', loadChildren: 'app/pages/credits/credits.module#CreditsModule', canActivate: [AuthGuard]},
      /* 
      { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' },
      { path: 'editors', loadChildren: './editors/editors.module#EditorsModule' },
      { path: 'components', loadChildren: './components/components.module#ComponentsModule' },
      { path: 'charts', loadChildren: './charts/charts.module#ChartsModule' },
      { path: 'ui', loadChildren: './ui/ui.module#UiModule' },
      { path: 'forms', loadChildren: './forms/forms.module#FormsModule' },
      { path: 'tables', loadChildren: './tables/tables.module#TablesModule' },
      { path: 'maps', loadChildren: './maps/maps.module#MapsModule' } */
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
