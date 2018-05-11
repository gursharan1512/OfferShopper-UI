import { Component, OnInit } from '@angular/core';
import { SearchService } from '../../services/search.service';


@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
  providers: [SearchService]
})
export class HomePageComponent implements OnInit {

  date = new Date();
  token:any;

  constructor() {}
  
  ngOnInit() {
    let time = "T"+this.date.getHours()+":"+this.date.getMinutes()+":"+this.date.getSeconds()+"Z";
  }
}