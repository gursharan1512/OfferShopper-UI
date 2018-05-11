import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import { HttpClientModule } from '@angular/common/http'; 
import { HttpModule } from '@angular/http';

import { Search } from '../configs/search.config'

@Injectable()
export class SearchService {
  
  public keywords:any=[];
  public products:any=[];
  public defaultKeywords:any=[""];

  constructor(private http: Http) { }

  search(terms: Observable<string>) {
    return terms.debounceTime(100)
      .distinctUntilChanged()
      .switchMap(term => this.searchEntries(term));
  }

  searchEntries(term) {

    this.keywords=this.http
        .get(Search.baseUrl + term)
        .map(res => res.json(),
        (error: any)=>this.handleError(error));
        return this.keywords; 
    }

        private handleError(error: Response){
          return Observable.throw(error.statusText);
        }


      searchProducts(result){
        this.products=this.http
        .get(Search.baseUrlProduct + result)
        .map(res => res.json(),
        (error: any)=>this.handleError(error));
        return this.products; 
      } 

      searchProductsCategoryOnly(category) {
        this.products=this.http
        .get(Search.baseUrlCategorySearch+category)
        .map(res => res.json(),
        (error: any)=>this.handleError(error));
        return this.products;
      }

      searchProductsCategoryAndKey(category, key) {
        this.products=this.http
        .get(Search.baseUrlCategoryProductSearchUrl1+category+"/"+
          Search.baseUrlCategoryProductSearchUrl2+key)
        .map(res => res.json(),
        (error: any)=>this.handleError(error));
        return this.products;
      }
}