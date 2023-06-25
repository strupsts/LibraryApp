import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../../../core/services/api.service";
import {IBook} from "../../../../shared/interfaces/IBook";
import {Observable, Subscription} from "rxjs";
import {Router} from "@angular/router";
import {AlertController} from "@ionic/angular";
import {ILanguages} from "../../../../shared/interfaces/ILanguages";
import {switchMap, tap} from "rxjs/operators";
import {IMinMaxPages} from "../../../../shared/interfaces/IMinMaxPages";
import {SqlBaseService} from "../../../../core/services/sql-base.service";


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


  constructor(public api: ApiService, private router: Router,private alertController: AlertController, public db: SqlBaseService) {
    this.getData()
  }


  ngOnInit() {
  }
  ngOnDestroy() {
    if (this.sub1) this.sub1.unsubscribe();
  }



  async getData() {
    this.db.createDatabase().then(() => this.getBooks())


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
  getBooks() {
      // С WebSQL ещё не приходилось разбираться, ранее использовал хранилища
      // web local storage, cookies, ionic storage. Дошел до этой части и понял что половину кода
      // касательно манипуляции данных из api.service нужно переписывать под WebSQL
      // this.db.getBooks().then((data) => {
      //   console.log('BOOKS::', data)
      // })
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
