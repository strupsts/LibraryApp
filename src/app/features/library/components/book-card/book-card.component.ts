import {Component, Input, OnInit} from '@angular/core';
import {IBook} from "../../../../shared/interfaces/IBook";
import {ApiService} from "../../../../core/services/api.service";
import {LibraryService} from "../../services/library.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.scss'],
})
export class BookCardComponent implements OnInit{
  @Input() book!:IBook;
  langImgUrl!: string;
  genres$: Observable<string[]>
  genres: string;
  constructor(private libraryService: LibraryService) {}

  setImgUrl(lang:string) {
    return `url('assets/images/langs/${lang}.png')`
  }

  ngOnInit(): void {
    this.langImgUrl = this.setImgUrl(this.book.language);
    this.libraryService.getGenresList().subscribe(() => {
      this.genres = this.libraryService.getCurrentBookGenres(this.book.genre);
    })
  }



}
