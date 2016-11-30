import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule }   from '@angular/router';

import { AppComponent } from './app.component';

// Pages
import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

// Client 
import { ClientComponent } from './client/client.component';

  // Users
import { UserComponent } from './user/user.component';
import { UserAddComponent } from './user/user-add.component';
import { UserEditComponent } from './user/user-edit.component';
import { UserViewComponent } from './user/user-view.component';

  // Operations
import { OperationComponent } from './operation/operation.component';
import { OperationAddComponent } from './operation/operation-add.component';
import { OperationEditComponent } from './operation/operation-edit.component';
import { OperationViewComponent } from './operation/operation-view.component';

// Utils
import { BackButtonComponent } from './utils/back-button/back-button.component';

// Services 
import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';
import { OperationService } from './operation/operation.service';
import { HttpClient } from './http-client';

// Guards
import { AuthGuard } from './auth/auth.guard';
import { AlreadyLoggedInGuard } from './auth/already-logged-in.guard';


@NgModule({
  declarations: [
    AppComponent,
    BackButtonComponent,
    AuthComponent,
    HomeComponent,
    PageNotFoundComponent,
    UserComponent,
    UserAddComponent,
    UserEditComponent,
    UserViewComponent,
    OperationComponent,
    OperationAddComponent,
    OperationEditComponent,
    OperationViewComponent,
    ClientComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, canActivate: [AuthGuard] },
      { path: 'client', component: ClientComponent, canActivate: [AuthGuard] },
      { path: 'users', component: UserComponent, canActivate: [AuthGuard] },
      { path: 'users/add', component: UserAddComponent, canActivate: [AuthGuard] },
      { path: 'users/edit/:id', component: UserEditComponent, canActivate: [AuthGuard] },
      { path: 'users/view/:id', component: UserViewComponent, canActivate: [AuthGuard] },
      { path: 'operations', component: OperationComponent, canActivate: [AuthGuard] },
      { path: 'operations/add', component: OperationAddComponent, canActivate: [AuthGuard] },
      { path: 'operations/edit/:id', component: OperationEditComponent, canActivate: [AuthGuard] },
      { path: 'operations/view/:id', component: OperationViewComponent, canActivate: [AuthGuard] },
      { path: 'auth', component: AuthComponent , canActivate: [AlreadyLoggedInGuard] },
      { path: '**', redirectTo: '' }
    ])
  ],
  providers: [HttpClient, OperationService, UserService, AlreadyLoggedInGuard, AuthGuard, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
