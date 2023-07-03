import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../../../core/services/api.service";
import {IBook} from "../../../../shared/interfaces/IBook";
import {Observable, Subscription, Subject} from "rxjs";
import {Router} from "@angular/router";
import {AlertController, Platform} from "@ionic/angular";
import {ILanguages} from "../../../../shared/interfaces/ILanguages";
import {switchMap, take, tap} from "rxjs/operators";
import {IMinMaxPages} from "../../../../shared/interfaces/IMinMaxPages";
import {IAuthors, LibraryService} from "../../services/library.service";



@Component({
  selector: 'app-books-main',
  templateUrl: './books-main.page.html',
  styleUrls: ['./books-main.page.scss'],
})
export class BooksMainPage implements OnInit {
  booksArr: IBook[];
  authors: Observable<IAuthors[]>;
  update$: Subject<void> = new Subject<void>();

  searchInput: string = '';
  selectedGenre: number | false = false;
  selectedLanguage: string[] = [];
  selectedAuthors: string[] = [];
  minPage: number = 0;
  maxPage: number = 0;


  genres: string[] = [];
  languages: ILanguages[] = [];

  minMaxPages: { min: number, max: number } = { min: 0, max: 0}

  sub1!: Subscription;
  sub_books: Subscription;


  constructor(public api: ApiService,
              private router: Router,
              private platform: Platform,
              public libraryService: LibraryService) {}


  ngOnInit() {
    this.getData()
  }
  ngOnDestroy() {
    if (this.sub1) this.sub1.unsubscribe();
    if (this.sub_books) this.sub_books.unsubscribe();
  }


  getData() {
    this.sub_books = this.libraryService.getBooks().subscribe((books: IBook[]) => {
      this.booksArr = books
    })
    this.libraryService.getGenresList().subscribe((genresArr: string[]) => {
      this.genres = genresArr
    });
    this.authors = this.libraryService.getAuthors();


    this.languages = this.libraryService.getLanguagesList();

    this.sub1 = this.libraryService.setMinMaxPages().pipe(
      tap(() => {
        this.libraryService.getMinMaxPages().subscribe((minMaxPages: IMinMaxPages) => {
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
