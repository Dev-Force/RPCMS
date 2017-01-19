import { Http } from '@angular/http';
import { AuthService } from 'auth/auth.service';
import { Injectable } from '@angular/core';
import { HttpClient } from 'utils/http-client';
import { Urls } from 'remote-urls';
import { IP } from 'ip-blacklist/ip';

@Injectable()
export class IPBlacklistService {

  private ipsUrl: string = Urls.ipblacklist;


  constructor(
      private http: HttpClient,
      private authService: AuthService
  ) { }

  public getIPs() {
    return this.http.get(this.ipsUrl);
  }

  public getIP(op_id) {
    return this.http.get(this.ipsUrl + '/' + op_id);
  }

  public addIP(ip: IP) {
    return this.http.post(this.ipsUrl, ip);
  }

  public editIP(ip: IP) {
    return this.http.put(this.ipsUrl + '/' + ip._id, ip);
  }

  public deleteIPs(ips: IP[]) {
    return this.http.post(this.ipsUrl + '/deleteMass', ips.map(el => el._id));
  }

  public deleteIP(ip: IP) {
    return this.http.delete(this.ipsUrl + '/' + ip._id);
  }


}
