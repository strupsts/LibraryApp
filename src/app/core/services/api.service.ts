import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {IBook} from "../../shared/interfaces/IBook";


@Injectable()
export class ApiService {

  URL: string =  'assets/json/';

  constructor(private http: HttpClient) {
  }

  getAllBooks(): Observable<IBook[]> {
    return this.http.get<IBook[]>(this.URL + 'books.json')
  }

}
