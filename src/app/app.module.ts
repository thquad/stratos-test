import { paginationReducer } from './store/reducers/pagination.reducer';
import { CNSISEffect } from './store/effects/cnsis.effects';
import { cnsisReducer } from './store/reducers/cnsis.reducer';
import { UAASetupEffect } from './store/effects/uaa-setup.effects';
import { uaaSetupReducer } from './store/reducers/uaa-setup.reducers';
import { AppState } from './store/app-state';
import { environment } from './../environments/environment';
import { AuthGuardService } from './auth-guard.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MDAppModule } from './md/md.module';
import { AuthEffect } from './store/effects/auth.effects';
import { authReducer } from './store/reducers/auth.reducer';
import { HttpModule } from '@angular/http';
import { APIEffect } from './store/effects/api.effects';
import { EffectsModule } from '@ngrx/effects';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ActionReducer, State, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';

import { entitiesReducer } from './store/reducers/api.reducer';

import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { DashboardBaseComponent } from './dashboard-base/dashboard-base.component';

import { storeLogger } from 'ngrx-store-logger';
import { SideNavComponent } from './side-nav/side-nav.component';
import { ConsoleUaaWizardComponent } from './console-uaa-wizard/console-uaa-wizard.component';
import { SteppersComponent } from './steppers/steppers.component';
import { StepComponent } from './step/step.component';

import 'rxjs/add/observable/from';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';

export function logger(reducer): any {
  // default, no options
  return storeLogger()(reducer);
}

export const metaReducers = environment.production ? [] : [logger];

const appRoutes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'uaa', component: ConsoleUaaWizardComponent },
  { path: 'login', component: LoginPageComponent },
  {
    path: 'dashboard',
    component: DashboardBaseComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: '',
        children: [
          { path: '', component: HomePageComponent }
        ],
      }
    ]
  }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    HomePageComponent,
    DashboardBaseComponent,
    SideNavComponent,
    ConsoleUaaWizardComponent,
    SteppersComponent,
    StepComponent
  ],
  imports: [
    HttpModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MDAppModule,
    BrowserAnimationsModule,
    StoreModule.forRoot({
      entities: entitiesReducer,
      auth: authReducer,
      uaaSetup: uaaSetupReducer,
      cnsis: cnsisReducer,
      pagination: paginationReducer
    }, {
        metaReducers
      }),
    RouterModule.forRoot(
      appRoutes
    ),
    StoreDevtoolsModule.instrument({
      maxAge: 25
    }),
    EffectsModule.forRoot([
      APIEffect,
      AuthEffect,
      UAASetupEffect,
      CNSISEffect
    ])
  ],
  providers: [
    AuthGuardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
