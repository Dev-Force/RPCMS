import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule }   from '@angular/router';

import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth/auth.guard';
import { AuthService } from './auth/auth.service';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import { AlreadyLoggedInGuard } from './auth/already-logged-in.guard';
import { UserComponent } from './user/user.component';
import { OperationComponent } from './operation/operation.component';


@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    HomeComponent,
    PageNotFoundComponent,
    UserComponent,
    OperationComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, canActivate: [AuthGuard] },
      { path: 'users', component: UserComponent, canActivate: [AuthGuard] },
      { path: 'operations', component: OperationComponent, canActivate: [AuthGuard] },
      { path: 'auth', component: AuthComponent , canActivate: [AlreadyLoggedInGuard] },
      { path: '**', redirectTo: '' }
    ])
  ],
  providers: [AlreadyLoggedInGuard, AuthGuard, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
