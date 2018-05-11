import { Component, OnInit, Output, EventEmitter,ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ProductDetailService } from './../../services/product-detail.service';
import { WishlistService } from './../../services/wishlist.service';
import { CarrybagService } from './../../services/carrybag.service';
import { AuthorizationService } from './../../services/authorization.service';
import { MessageService } from './../../services/message.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css'],
  providers:[ProductDetailService, WishlistService, AuthorizationService,MessageService,CarrybagService]
})

export class ProductPageComponent implements OnInit {

  vendorId: string;
  offerId: string;

  @Output() success = new EventEmitter<any>();
  public shop: string;
  public searchedProduct: string;
  public productName : string;
  public productDescription : string;
  public productValidity :string;
  public productOriginalPrice :string;
  public productDiscount :string;
  public imageURL :string;
  public productSeller :string;
  public offer :any;
  public userInfo : any;
  public user : any;
  public category: any;
  public relatedProducts: any;

  constructor(
    private productDetailService : ProductDetailService,
    private route: ActivatedRoute,
    private wishlistService:WishlistService,
    private authorizationService: AuthorizationService,
    private carrybagService: CarrybagService,
    private messageService: MessageService,
    private _vcr: ViewContainerRef,
    private _location: Location
    ) { }

  ngOnInit() {
    this.getUserId();
    this.vendorId=this.route.snapshot.params.id;
    this.offerId = this.route.snapshot.params.offerId;
    if( this.vendorId && this.offerId) {
      this.getOfferById();
    }
    else {
      this.searchProduct();
    }
  }

 // Function to get customer name and make service call to get customer name from app
 searchProduct(){
   this.productDetailService.searchProduct(this.vendorId)
   .subscribe((res) =>{
     this.offer=res[0];
     this.productName=res[0].offerTitle;
     this.productDescription=res[0].offerDescription;
     this.productValidity=res[0].offerValidity;
     this.productOriginalPrice=res[0].originalPrice;
     this.productDiscount=res[0].offerDiscount;
     this.productSeller=res[0].userId;
     this.shop=res[0].address.name;
   },(error) =>{

   });
 }

  //Function will get the offer using offerId
  getOfferById() { 
    this.productDetailService.getOfferById(this.offerId)
    .subscribe((res) =>{
      this.offer=res;
      this.productName=res.offerTitle;
      this.productDescription=res.offerDescription;
      this.productValidity=res.offerValidity;
      this.productSeller=res.userId;
      this.productOriginalPrice=res.originalPrice;
      this.productDiscount=res.discount;
      this.shop=res.address.name;
      this.category=res.offerCategories; 
      this.imageURL=res.imageURL;  
      this.searchRelatedProducts(this.category);
    },(error) =>{
    });
  }

 //Function will get the userId 
 getUserId() {
   this.authorizationService.getUserId().subscribe((res) =>{
     this.userInfo = res.text().split(',');
     this.user = this.userInfo[2];
   }, (error) =>{
   })
 }

 //Function will add the product in the wishlist
 addToWishlist(offer1) {
   let wishlistBean = {
     "userId":this.user,
     "offerId":offer1.offerId,
     "offerTitle":offer1.offerTitle,
     "offerOriginalPrice":offer1.originalPrice,
     "offerDiscount":offer1.discount,
     "offerImage":offer1.imageURL,
     "offerValidity":offer1.offerValidity
   }
   this.wishlistService.addToWishlist(wishlistBean).subscribe((res) =>{
     this.messageService.showSuccessToast(this._vcr,"Added in wishlist");
   },(res:Response) =>{
     if(res.status==409){
       this.messageService.showErrorToast(this._vcr,"Already in Wishlist");
     }
     else if(res.status==400){
       this.messageService.showErrorToast(this._vcr,"Already in Wishlist");
     }
   })
 }

 //Function will add the offer in carrybag
 addToCarrybag(offer1) {
   let carrybagBean = {
     "userId":this.user,
     "offerId":offer1.offerId,
     "offerTitle":offer1.offerTitle,
     "offerOriginalPrice":offer1.originalPrice,
     "offerDiscount":offer1.discount,
     "offerImage":offer1.imageURL,
     "offerValidity":offer1.offerValidity,
     "vendorId":offer1.userId
   }
   this.carrybagService.addToCarrybag(carrybagBean).subscribe((res) =>{
     this.messageService.showSuccessToast(this._vcr,"Added in Carrybag");
   },(res:Response) =>{
     if(res.status==409){
       this.messageService.showErrorToast(this._vcr,"Already in CarryBag");
     }
     else if(res.status==400){
       this.messageService.showErrorToast(this._vcr,"Already in CarryBag");
     }
   })
 }

 //This function will show the offers related to the categories
 searchRelatedProducts(category){
   this.productDetailService.searchRelatedProducts(category).subscribe((res) =>{
     this.relatedProducts=res;
   },(error)=>{})
 }

 backClicked() {
        this._location.back();
  }
}
