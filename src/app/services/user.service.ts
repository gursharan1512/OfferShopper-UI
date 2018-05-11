import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { UserData } from '../configs/userdata.config'
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {

  private header;
  options:RequestOptions;

  constructor(private http: Http) {
    this.header = new Headers();
    this.header.append('Authorization',localStorage.getItem("application-token"));
    this.options = new RequestOptions({headers: this.header});
  }


  getProfile(userId:string){
    return this.http.get(UserData.userUrl+userId, this.options)
    .map(data => data.json(),
      (error: any)=>console.log("error in getting data from database"));
  }

  putProfile(obj){
    return this.http.put(UserData.updateUrl,obj, this.options)
    .map(data => data.status,
      (error: any)=>console.log("error"));
  }
  
  convertToVendor(obj) {
    return this.http.post(UserData.convertToVendorUrl, obj, this.options)
    .map((res:Response) => {
      localStorage.removeItem("application-token");
      localStorage.setItem("application-token",res.text());
    },
      (error: any)=>console.log("error"));
  }

  getVendorByCity(location : string) {
    return this.http.get(UserData.getVendorsByLocationUrl+location, this.options)
    .map(data => data.json(),
      (error: any)=>console.log("error.."));
  }
}