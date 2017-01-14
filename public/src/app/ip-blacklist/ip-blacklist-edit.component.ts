import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IPBlacklistService } from './ip-blacklist.service';
import { IP } from './ip';
import 'rxjs/add/operator/map';

@Component({
    selector: 'app-ip-blacklist-edit',
    templateUrl: './ip-blacklist-edit.component.html',
    styleUrls: ['./ip-blacklist.component.scss']
})
export class IPBlacklistEditComponent implements OnInit {

    public ip: IP = new IP();
    public success: boolean = false;
    public error: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private ipBlacklistService: IPBlacklistService
    ) { }

    ngOnInit() {
        this.ipBlacklistService.getIP(this.route.snapshot.params['id'])
            .map(response => response.json())
            .subscribe(response => {
                this.ip = response as IP;
            });
    }

    onSubmit() {
        this.ipBlacklistService.editIP(this.ip)
            .map(response => response.json())
            .subscribe(response => {
                if(response.errmsg || response.errors) {
                    this.error = true;
                    this.success = false;
                } else {
                    this.error = false;
                    this.success = true;
                }
            }, err => {
                this.error = false;
                this.success = true;
            });
    }

}
