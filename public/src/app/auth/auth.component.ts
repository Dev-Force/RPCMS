import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Credentials } from './credentials';
import { AuthService } from './auth.service';

declare var jQuery: any;

@Component({
  selector: 'app-login',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  public credentials: Credentials;

  constructor(private router: Router, private authService: AuthService, private elRef: ElementRef) { }
  
  private successFunction() {
    let modal = jQuery(this.elRef.nativeElement).find('.ui.modal.success');
    modal.modal({detachable: false}).modal('show');
    setTimeout(() => {
      modal.modal({detachable: false}).modal('hide');
      if(this.authService.redirectUrl) this.router.navigateByUrl(this.authService.redirectUrl);
      else this.router.navigate(['/']);
    }, 2000);
  }

  ngOnInit() {
    this.authService.checkIpAuth()
      .subscribe(response => {
        if(response.success) 
          if(this.authService.redirectUrl != null) this.router.navigateByUrl(this.authService.redirectUrl);
          else this.router.navigate(['']);
      }, err => {
        console.log(err);
      });
    this.credentials = new Credentials();
  }

  onSubmit() {
    this.authService.checkTokenAuth(this.credentials)
      .subscribe(response => {
        // If ipAuth was successful skip this then (*** Check if this is needed ***)
        if(!response) return;
        if(response.success) this.successFunction();
        else jQuery(this.elRef.nativeElement).find('.ui.modal.error').modal({detachable: false}).modal('show');
      }, err => {
        console.log('There was an error processing your request: ' + err);
      });
  }

}
