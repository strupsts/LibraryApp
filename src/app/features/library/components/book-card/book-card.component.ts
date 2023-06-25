import {Component, Input, OnInit} from '@angular/core';
import {IBook} from "../../../../shared/interfaces/IBook";
import {ApiService} from "../../../../core/services/api.service";

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.scss'],
})
export class BookCardComponent implements OnInit{
  @Input() book!:IBook;
  langImgUrl!: string;
  genres!:string;
  constructor(private api: ApiService) {}

  setImgUrl(lang:string) {
    return `url('assets/images/langs/${lang}.png')`
  }

  ngOnInit(): void {
    this.langImgUrl = this.setImgUrl(this.book.language);
    console.log(this.book.genre)
    this.genres = this.api.getGenres(this.book.genre);
  }



}
