import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { IPBlacklistService } from './ip-blacklist.service';
import { AuthService } from 'auth/auth.service';
import { Observable } from 'rxjs/Rx';
import { IP } from './ip';
import 'rxjs/add/operator/map';

@Component({
    selector: 'app-ip-blacklist-add',
    templateUrl: './ip-blacklist-add.component.html',
    styleUrls: ['./ip-blacklist.component.scss']
})
export class IPBlacklistAddComponent {

    public ip: IP = new IP();
    public success: boolean = false;
    public error: boolean = false;

    constructor(
        private ipBlacklistService: IPBlacklistService
    ) { }

    onSubmit() {
        this.ipBlacklistService.addIP(this.ip)
            .map(response => response.json())
            .subscribe(response => {
                if(response.errmsg || response.errors) {
                    this.error = true;
                    this.success = false;
                } else {
                    this.error = false;
                    this.success = true;
                }
            });
    }

}
