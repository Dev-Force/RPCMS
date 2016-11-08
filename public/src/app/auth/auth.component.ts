import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Credentials } from './credentials';
import { AuthService } from './auth.service';
import 'rxjs/add/operator/map';

declare var jQuery: any;

@Component({
  selector: 'app-login',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  public credentials: Credentials;

  constructor(private router: Router, private authService: AuthService, private elRef: ElementRef) { }
  
  ngOnInit() {
    this.credentials = new Credentials();
  }

  onSubmit() {
    this.authService.checkAuth(this.credentials)
      .then(response => {
        if(response.success) {
            let modal = jQuery(this.elRef.nativeElement).find('.ui.modal.success');
            modal.modal({detachable: false}).modal('show');
            setTimeout(() => {
                modal.modal({detachable: false}).modal('hide');
                this.router.navigate(['/']);
            }, 2000);
        }
        else jQuery(this.elRef.nativeElement).find('.ui.modal.error').modal({detachable: false}).modal('show');
      })
      .catch(err => {
        console.log('There was an error processing your request');
      });
  }

}
