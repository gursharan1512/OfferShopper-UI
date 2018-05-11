import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import{UserService} from './../../../services/user.service';
import { AuthorizationService } from '../../../services/authorization.service';
import {FormsModule} from '@angular/forms';
import { Router } from '@angular/router';
import {States} from '../../../configs/state.config';
import {Cities} from '../../../configs/cities.config';

@Component({
  selector: 'app-be-a-seller',
  templateUrl: './be-a-seller.component.html',
  styleUrls: ['./be-a-seller.component.css'],
  providers:[ AuthorizationService,UserService ]
})

export class BeASellerComponent implements OnInit {

  @Output() success = new EventEmitter<any>();
  offerIdList:Array<String>=[];
  obj={};
  states= States.states;
  cities=Cities.citiesName;
  data:any;
  firstName:string;
  lastName:string;
  phone:string;
  emailId:string;
  role:string;
  name:string;
  number:string;
  street:string;
  city:string;
  zip:number;
  state:string;
  password:string;
  dob:string;
  gender:string;
  spinCount:number;
  osCash:number;
  shopName:string;
  shopNumber:string;
  shopStreet:string;
  shopCity:string;
  shopState:string;
  shopZip:number;
  vendorMobileNo:string;
  timestamp:number;
  public userInfo;
  public userId;

  constructor(private userdata:UserService,
    private router: Router,
    private authorizationService: AuthorizationService) { }

  ngOnInit() {
    this.getUserId();
  }

  //Function will give the userId from token
  getUserId() {
    this.authorizationService.getUserId().subscribe((res) =>{
      if(res.text() == "UnAuthorized"){
        this.router.navigate(['/login']);
      }
      this.userInfo = res.text().split(',');
      this.userId = this.userInfo[2];
      this.getProfile(this.userId);
    }, (error) =>{
    })
  }

  //Function will retrieve the user details using userId
  getProfile(userId){
    this.userdata.getProfile(userId).subscribe((res) =>{
      this.obj=res;
      this.data = res;
      this.firstName=this.data.firstName;
      this.lastName=this.data.lastName;
      this.phone=this.data.mobileNo;
      this.emailId=this.data.email;
      this.role=this.data.role;
      this.name=this.data.address.name;
      this.number=this.data.address.number;
      this.street=this.data.address.street;
      this.city=this.data.address.city;
      this.zip=this.data.address.zipCode;
      this.state=this.data.address.state;
      this.password=this.data.password;
      this.dob=this.data.dob;
      this.gender=this.data.gender;
      this.spinCount=this.data.spinCount;
      this.osCash=this.data.osCash;
      this.shopName=this.data.shopAddress.name;
      this.shopNumber=this.data.shopAddress.number;
      this.shopStreet=this.data.shopAddress.street;
      this.shopCity=this.data.shopAddress.city;
      this.shopState=this.data.shopAddress.state;
      this.shopZip=this.data.shopAddress.zipCode;
      this.vendorMobileNo=this.data.vendorMobileNo;
      this.timestamp=this.data.timestamp;
      this.offerIdList=this.data.offerIdList;
    },(error) =>{
    })
  }

  //Function will make form editable
  undisableTxt() {
    (<HTMLInputElement>document.getElementById("firstName")).disabled= false;
    (<HTMLInputElement>document.getElementById("lastName")).disabled = false;
    (<HTMLInputElement>document.getElementById("phone")).disabled = false;
    (<HTMLInputElement>document.getElementById("inputAddress")).disabled = false;
    (<HTMLInputElement>document.getElementById("inputCity")).disabled = false;
    (<HTMLInputElement>document.getElementById("inputZip")).disabled = false;
    (<HTMLInputElement>document.getElementById("inputState")).disabled = false;
    (<HTMLInputElement>document.getElementById("inputShopName")).disabled = false;
    (<HTMLInputElement>document.getElementById("inputShopAddress")).disabled = false;
    (<HTMLInputElement>document.getElementById("inputShopCity")).disabled = false;
    (<HTMLInputElement>document.getElementById("inputShopZip")).disabled = false;
    (<HTMLInputElement>document.getElementById("inputShopState")).disabled = false;
  };

  //Function will update the vendor details 
  submit(){
    (<HTMLInputElement>document.getElementById("firstName")).disabled= true;
    (<HTMLInputElement>document.getElementById("lastName")).disabled = true;
    (<HTMLInputElement>document.getElementById("phone")).disabled = true;
    (<HTMLInputElement>document.getElementById("inputAddress")).disabled = true;
    (<HTMLInputElement>document.getElementById("inputCity")).disabled = true;
    (<HTMLInputElement>document.getElementById("inputZip")).disabled =true;
    (<HTMLInputElement>document.getElementById("inputState")).disabled = true;
    (<HTMLInputElement>document.getElementById("inputShopName")).disabled = true;
    (<HTMLInputElement>document.getElementById("inputShopAddress")).disabled = true;
    (<HTMLInputElement>document.getElementById("inputShopCity")).disabled = true;
    (<HTMLInputElement>document.getElementById("inputShopZip")).disabled = true;
    (<HTMLInputElement>document.getElementById("inputShopState")).disabled = true;
    let obj={
      "firstName": this.firstName,
      "lastName": this.lastName,
      "password": this.password,
      "role": this.role,
      "mobileNo":this.phone,
      "email": this.emailId,
      "dob": this.dob,
      "address": {
        "name": this.name,
        "number":this.number,
        "street": this.street,
        "city": this.city,
        "state":this.state,
        "zipCode":this.zip
      },
      "gender":this.gender,
      "spinCount":this.spinCount,
      "osCash": this.osCash,
      "shopAddress": {
        "name": this.shopName,
        "number":this.shopNumber,
        "street": this.shopStreet,
        "city": this.shopCity,
        "state": this.shopState,
        "zipCode": this.shopZip
      },
      "vendorMobileNo":this.vendorMobileNo,
      "offerIdList":this.offerIdList,
      "timestamp": this.timestamp
    }
    console.log(obj);
    this.userdata.putProfile(obj).subscribe((res) =>{
      if(obj.shopAddress.name && obj.shopAddress.street && obj.shopAddress.city && obj.shopAddress.state && obj.shopAddress.zipCode) {
        this.userdata.convertToVendor(obj).subscribe((res) => {
          this.success.emit(true);
        }, (error) =>{})        
      }
    }, (error) =>{
    })
  }

  //Function will set the shop address
  setShopAddress() {
    this.shopState = this.state;
    this.shopZip = this.zip;
  }

  //Function will copy the same address from above
  setCheckboxAddress() {
    this.shopState = this.state;
    this.shopZip = this.zip;
    this.shopStreet = this.street;
    this.shopCity =  this.city;
  }

}
