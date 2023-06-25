import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {IBook} from "../../shared/interfaces/IBook";
import {ILanguages} from "../../shared/interfaces/ILanguages";
import {map} from "rxjs/operators";
import {IMinMaxPages} from "../../shared/interfaces/IMinMaxPages";

@Injectable()
export class ApiService {

  // Лучше было бы создать 2 отдельных api.service и library.service, но ionic material заняли часов 12 моего
  // времени, спасибо дырявой документации, писал бы с нуля стили - быстрее бы вышло)

  genresBase: string[] = [
    "IT",
    "Психология",
    "Научпоп",
    "Разработка (DEV)",
    "Драма",
    "Классика"
  ]
  languages: ILanguages[] = [
    {key: "ru", value: "Русский"},
    {key: "en", value: "Английский"},
    {key: "de", value: "Немецкий"},
  ]
  allAuthors: string[] = [];
  minPage: number = 0;
  maxPage: number = 0;

  URL: string =  'assets/json/';

  constructor(private http: HttpClient) {
    this.setAllAuthors()
  }

  getAllBooks(): Observable<IBook[]> {
    return this.http.get<IBook[]>(this.URL + 'books.json')
  }

  getAllGenres():string[] {
    return this.genresBase
  }
  getGenres (genreNums: number[]): string {
    let genreArr = genreNums.map(genreNum=>{
      return this.genresBase.find((genre, index)=>index+1 === genreNum  )
    })
    return genreArr.join(', ')
  };

  getAllLanguages(): ILanguages[]  {
    return this.languages
  }

  // Конечно лучше было бы создать экземпляр массива с книгами, вместе постоянных запросов на сервер,
  // но так как это тестовое задание, и я хочу показать работу со стримом booksArr$ в шаблоне - оставляю так.

  setAllAuthors (): void {
    const sub$ = this.getAllBooks().subscribe((books: IBook[]) => books.forEach((b: IBook) => {
      this.allAuthors.push(b.author)
      sub$.unsubscribe()
    } ))
  }
  getAllAuthors (): string[] {
    return this.allAuthors
  }


  setMinMaxPages(): Observable<void> {
      return new Observable ((observer) => {
        const sub = this.getAllBooks().pipe(
          map((arr: IBook[]) => arr.map((book) => book.pages))
        )
          .subscribe((pages: number[]) =>  {
            for (let i = 0; i < pages.length; i++) {
              if (pages[i] > this.maxPage || this.maxPage === 0) this.setMaxPage(pages[i]);
              if (pages[i] < this.minPage || this.minPage === 0) this.setMinPage(pages[i]);
            }
            console.log(this.maxPage)
            observer.next()
          })
      })
  }

  setMinPage(pages: number): void {
    this.minPage = pages
  }
  setMaxPage(pages: number): void {
    this.maxPage = pages
  }

  getMinMaxPages(): Observable<IMinMaxPages>  {
      return new Observable ((observer) => {
          observer.next({ min: this.minPage, max: this.maxPage })
    })
  }



}
