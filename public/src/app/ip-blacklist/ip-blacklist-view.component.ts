import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IPBlacklistService } from './ip-blacklist.service';
import { IP } from './ip';
import 'rxjs/add/operator/map';

@Component({
    selector: 'app-ip-blacklist-view',
    templateUrl: './ip-blacklist-view.component.html',
    styleUrls: ['./ip-blacklist.component.scss']
})
export class IPBlacklistViewComponent implements OnInit {

    public ip: IP = new IP();

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

}
