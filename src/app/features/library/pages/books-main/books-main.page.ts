import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../../../core/services/api.service";
import {IBook} from "../../../../shared/interfaces/IBook";
import {Observable, Subscription} from "rxjs";
import {Router} from "@angular/router";
import {BookPage} from "../book/book.page";
import {AlertController} from "@ionic/angular";
import {ILanguages} from "../../../../shared/interfaces/ILanguages";
import {switchMap, tap} from "rxjs/operators";
import {IMinMaxPages} from "../../../../shared/interfaces/IMinMaxPages";


@Component({
  selector: 'app-books-main',
  templateUrl: './books-main.page.html',
  styleUrls: ['./books-main.page.scss'],
})
export class BooksMainPage implements OnInit {
  booksArr$!: Observable<IBook[]>;
  searchInput: string = '';
  selectedGenre: number | false = false;
  selectedLanguage: string[] = [];
  selectedAuthors: string[] = [];
  minPage: number = 0;
  maxPage: number = 0;


  genres: string[] = [];
  languages: ILanguages[] = [];
  authors: string[] = [];
  minMaxPages: { min: number, max: number } = { min: 0, max: 0}

  sub1!: Subscription;


  constructor(public api: ApiService, private router: Router,private alertController: AlertController) {
    this.getData()
  }


  ngOnInit() {
  }
  ngOnDestroy() {
    if (this.sub1) this.sub1.unsubscribe();
  }

  changod() {

    console.log(this.minMaxPages)
  }

  getData() {
    this.booksArr$ = this.api.getAllBooks();
    this.genres = this.api.getAllGenres();
    this.languages = this.api.getAllLanguages();
    this.authors = this.api.getAllAuthors();

    this.sub1 = this.api.setMinMaxPages().pipe(
      tap(() => {
        this.api.getMinMaxPages().subscribe((minMaxPages: IMinMaxPages) => {
          this.minMaxPages = minMaxPages;
          this.minPage = minMaxPages.min
          this.maxPage = minMaxPages.max
        });
      })
    ).subscribe();
  }


  openBookPage(book:IBook) {
    this.router.navigate([`library`, book.id], { state: { book } })
  }
  addNewBook() {

  }

  resetValue(nameOfVar: string) {
    switch (nameOfVar) {
      case "genre":
        this.selectedGenre = false;
        break;
      case "lang":
        this.selectedLanguage = []
        break;
      case "author":
        this.selectedAuthors = []
        break;
    }
    console.log(this.selectedLanguage)
  }
  incrementPage(value:string) {
     switch (value) {
       case "min":
         this.minPage++;
         break;
       case "max":
         this.maxPage++;
         break;
     }
  }
  decrementPage(value:string) {
    switch (value) {
      case "min":
        this.minPage--;
        break;
      case "max":
        this.maxPage--;
        break;
    }
  }

}
