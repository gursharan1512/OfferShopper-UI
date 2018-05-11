import { Component, OnInit, Output, EventEmitter,ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { AuthorizationService } from '../../../services/authorization.service';
import { MessageService } from '../../../services/message.service';
import { CarrybagService } from '../../../services/carrybag.service';
import { SearchService } from '../../../services/search.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-component',
  templateUrl: './search-component.component.html',
  styleUrls: ['./search-component.component.css'],
  providers: [SearchService,MessageService,AuthorizationService]
})

export class SearchComponentComponent implements OnInit {

  public results:any=[];

  //false only when category is all and user doesnt type a query
  searchFlag:boolean;
  flag :boolean;
  searchTerm$ = new Subject<string>();

  category : string = "";
  query : string = "";

  public userInfo : any;
  public user : any;

  constructor(private router : Router,
    private searchService: SearchService,
    private authorizationService: AuthorizationService,
    private messageService:MessageService,
    private _vcr:ViewContainerRef,
    private carrybagService: CarrybagService,) {
    //searching the keyword in redis database
    if(this.searchTerm$){
      this.searchService.search(this.searchTerm$)
      .subscribe(res => {
        this.results = res;
        if(res!="default")
        {
          this.flag=true;
        }
        else{
          this.flag=false;
        }
      });
    }
  }

  ngOnInit() {
    this.getUserId();
    this.category = 'Categories';
  }

  //Function retrieve the userId from the token
  getUserId() {
    this.authorizationService.getUserId().subscribe((res) =>{
      this.userInfo = res.text().split(',');
      this.user = this.userInfo[2];
    }, (error) =>{
    })
  }

  //Function adds the offer in carrybag
  addToCarrybag(offer1) {
    let carrybagBean = {
      "userId":this.user,
      "offerId":offer1.offerId,
      "offerTitle":offer1.offerTitle,
      "offerOriginalPrice":offer1.originalPrice,
      "offerDiscount":offer1.discount,
      "offerImage":"abcd",
      "offerValidity":offer1.offerValidity,
      "vendorId":offer1.userId
    }
    this.carrybagService.addToCarrybag(carrybagBean).subscribe((res) =>{
      this.messageService.showSuccessToast(this._vcr,"Added");
    },(error) =>{
      this.messageService.showSuccessToast(this._vcr,"Already Added");
    })
  }

  //Function will check the user is logged in or not
  notLogin(){
    this.messageService.showErrorToast(this._vcr,"Please Login");
  }

  //Function called on pressing Enter
  enterPressed(event) {
    if(event.keyCode == 13)
      document.getElementById("searchButton").click();
  }

  //Functions redirects to search Component except when category is all and user doesn't input any value
  redirectToSearch() {
    if(this.category=="Categories" && this.query =="") {
      this.messageService.showErrorToast(this._vcr,"Please select a category or type to search");
    }
    else {
      this.router.navigateByUrl("search/"+this.category+"/"+this.query);
    }
  }
}
