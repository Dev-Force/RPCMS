import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'user/user.service';
import { AuthService } from 'auth/auth.service';
import { IP } from 'ip-blacklist/ip';
import { IPBlacklistService } from 'ip-blacklist/ip-blacklist.service';

@Component({
  selector: 'app-ip-blacklist',
  templateUrl: './ip-blacklist.component.html',
  styleUrls: ['./ip-blacklist.component.scss']
})
export class IPBlacklistComponent implements OnInit {

  public ips: any = [];
  public checkboxAll: boolean;

  constructor(
      private router: Router,
      private route: ActivatedRoute,
      private ipBlacklistService: IPBlacklistService
  ) { }

  ngOnInit() {
    this.ipBlacklistService.getIPs()
      .map(response => response.json())
      .subscribe(ips => {
        this.ips = ips;
      });
  }

  public checkboxSelect(ip) {
    ip.selected = (ip.selected) ? false : true;
    if(this.ips.every(el => {
      if(el.selected === true) return true;
      return false;
    })) this.checkboxAll = true;
    else this.checkboxAll = false;
  }

  public checkboxSelectAll() {
    this.ips.forEach(el => {
      el.selected = !this.checkboxAll;
    });
  }

  public deleteIP(ip) {
    if(!confirm('Are you sure?')) return;
    this.ipBlacklistService.deleteIP(ip)
        .map(response => response.json())
        .subscribe(response => {
          if(response) {
            this.ips.splice(this.ips.indexOf(ip), 1);
            console.log('User deleted feedback');
          }
        });
  }

  public deleteIPs() {
    if(!confirm('Are you sure?')) return;
    this.ipBlacklistService.deleteIPs(
        this.ips
            .filter(el => el.selected)
            .map(el => el._id)
    )
        .map(response => response.json())
        .subscribe(response => {
          this.ips = this.ips.filter(el => {
            return !el.selected;
          });
        });
  }

}
