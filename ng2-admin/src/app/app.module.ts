import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
/*
 * Platform and Environment providers/directives/pipes
 */
import { routing } from './app.routing';

// App is our top level component
import { App } from './app.component';
import { AppState, InternalStateType } from './app.service';
import { GlobalState } from './global.state';
import { NgaModule } from './theme/nga.module';
import { PagesModule } from './pages/pages.module';

import { AuthGuard } from './pages/services/oauth/auth.guard.component';
import { AuthGuarPED } from './pages/services/oauth/auth.guard.ped.component';
import { AuthenticationService } from './pages/services/oauth/authentication.service';
import { ProductService }  from './pages/services/product.service';
import { LaboratoriesService } from './pages/services/laboratories.service';
import { ClientsService } from './pages/services/clients.service';
import { MoneyflowService } from './pages/services/money.flow.service';


// Application wide providers
const APP_PROVIDERS = [
  AppState,
  GlobalState,
  AuthenticationService,
  AuthGuard,
  AuthGuarPED,
  ProductService,
  LaboratoriesService,
  ClientsService,
  MoneyflowService
];

export type StoreType = {
  state: InternalStateType,
  restoreInputValues: () => void,
  disposeOldHosts: () => void
};

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [App],
  declarations: [
    App
  ],
  imports: [ // import Angular's modules
    BrowserModule,
    HttpModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgaModule.forRoot(),
    NgbModule.forRoot(),
    PagesModule,
    routing
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    APP_PROVIDERS
  ]
})

export class AppModule {

  constructor(public appState: AppState) {
  }
}
