import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {AddOfferConfig} from '../configs/add-offer-config';

@Injectable()
export class AddOfferService {

	private header;
  private imageHeader;
  options:RequestOptions;
  imageOptions:RequestOptions;
  public userInfo;
  public userId;

  constructor(private http: Http) {
    this.header = new Headers();
    this.imageHeader = new Headers();
    this.imageHeader.append('Content-Type', 'multipart/form-data');
    this.imageHeader.append('Accept', 'application/json');
    this.imageOptions = new RequestOptions({ headers: this.imageHeader });

    this.header.append('Authorization', localStorage.getItem("application-token"));
    this.options = new RequestOptions({headers: this.header});
  }

  addImage(formData){
    return this.http.post("http://10.151.60.204:8801/upload", formData)
    .map((res:Response) =>res,(error: any)=>console.log("error"+error));
  }
  
  getOffersList(userId){
    return this.http.get(AddOfferConfig.getURL+userId+"/offers", this.options)
    .map(data => data.json(),
      (error: any)=>console.log("error in getting data from database")); 
  }

  deleteOffer(offerId) {
  	return this.http.delete(AddOfferConfig.deleteOfferURL+offerId,this.options)
    .map(data => data.status,
      (error: any)=>console.log(error + "error in deleting offer"));
  }

  updateOffer(offerId) {
  	return this.http.put(AddOfferConfig.updateOfferURL+offerId, this.options)
    .map(data => data.status,
      (error: any)=>console.log(error + "error in deleting offer"));
  }

  putOffer(obj){
   return this.http.put(AddOfferConfig.updateOfferURL+obj.userId,obj, this.options)
    .map(data => data.json(),
      (error: any)=>console.log("error"));
  }

  addNewOffer(obj){
   return this.http.post(AddOfferConfig.addOfferURL,obj, this.options)
    .map(data => data.json(),
      (error: any)=>console.log("error"));
  }

  addToRedis(obj){
    return this.http.post(AddOfferConfig.addToRedisURL,obj, this.options) 
    .map(data => data.json(), 
      (error: any)=>console.log("unable to add to redis")); 
  }

  addToSoundex(obj)     {
    return this.http.post(AddOfferConfig.addToSoundexURL,obj, this.options) 
    .map(data => data.json(), 
      (error: any)=>console.log("unable to add to soundex")); 
  }

  couponValidateService(coupon,vendorId){
    return this.http.get(AddOfferConfig.validateCouponUrl+coupon+"/vendorId/"+vendorId, this.options)
    .map(data => data.json(),
      (error: any)=>console.log("error in getting data from database"));
  }

  changeFlag(obj) {
    return this.http.post(AddOfferConfig.couponFlagChangedUrl,obj, this.options)
    .map(data => data.json(),
      (error: any)=>console.log("error"));
  }

  putOffersInCarryBag(obj){
    return this.http.put(AddOfferConfig.updateOffersInCarryBag,obj, this.options)
    .map(data => data.json(),
      (error: any)=>console.log("error"));
  }


  getShopAddress(userId) {
    return this.http.get(AddOfferConfig.getVendorDetailURL+userId, this.options)
    .map(data => data.json(),
      (error: any)=>console.log("error in getting data from database"));
  }
//code not checked
getUser(userId) {
  return this.http.get(AddOfferConfig.getUserByIdURL+userId, this.options)
  .map(data => data.json(),
    (error: any)=>console.log("error in getting data from database"));
}

updateOsCash(cash:number,user){
  return this.http.put(AddOfferConfig.updateOsCashURL+cash+"/"+user, this.options)
   .map(data => data.json(),
 (error: any)=>console.log("error"));
}

getOffer(offerId){
  return this.http.get(AddOfferConfig.getOfferURL+offerId, this.options)
  .map(data => data.json(),
  (error: any)=>console.log("unable to get offer details"));
}


//code not checked

}
